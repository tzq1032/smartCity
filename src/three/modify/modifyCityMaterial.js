import * as THREE from 'three'
import gsap from 'gsap'


export default function modifyCityMaterial(mesh){
    
    mesh.material.onBeforeCompile = (shader)=>{
       
        gradColor(mesh,shader);
        addSpread(shader);
        addLightLine(shader);
        addTopLine(shader);
    }
}
export function gradColor(mesh,shader){
    mesh.geometry.computeBoundingBox();
    console.log(mesh.geometry.boundingBox);
    let {min,max} = mesh.geometry.boundingBox;
    let uHeight = max.y-min.y;
    // console.log(uHeight);
    shader.uniforms.uTopColor = {
        value: new THREE.Color("#AAAEFF")
    }
    shader.uniforms.uHeight = {
        value:uHeight,
    };
    shader.vertexShader = shader.vertexShader.replace(
        "include <begin_vertex>",

        `
            #include <begin_vertex>
            vPosition = position;
        `
    );
    shader.vertexShader = shader.vertexShader.replace(
        "include <common>",
        `
            #include <common>
            varying vec3 vPosition;
        `
    );


    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform vec3 uTopColor;
            uniform float uHeight;
            varying vec3 vPosition;
        `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
            #include <dithering_fragment>
            vec4 distGradColor = gl_FragColor;
            //设置混合的百分比
            float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
            //计算出混合颜色
            vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
            gl_FragColor = vec4(gradMixColor,1);
        `
    )

}

export function addSpread(shader){
    const center = new THREE.Vector2(0,0);
    shader.uniforms.uSpreadCenter = {
        value:center
    };
    shader.uniforms.uSpreadTime = {
        value:0
    };
    shader.uniforms.uSpreadWidth = {
        value:200
    };
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform vec2 uSpreadCenter;
        uniform float uSpreadTime;
        uniform float uSpreadWidth;
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
            #include <dithering_fragment>
            float spreadRadius = distance(vPosition.xz,uSpreadCenter);
            //扩散范围的函数
            float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
            if(spreadIndex>0.0){
                gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex/uSpreadWidth);
            }
        `
    );
    gsap.to(shader.uniforms.uSpreadTime,{
        value:1000,
        duration:3,
        ease:'none',
        repeat:-1,
    })
}

export function addLightLine(shader){
    shader.uniforms.uLightLineTime = {
        value:-1500
    };
    shader.uniforms.uLightLineWidth = {
        value:200
    };

    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
            #include <common>
            uniform float uLightLineTime;
            uniform float uLightLineWidth;
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        float LightLineMix = -(-2.0*vPosition.x+vPosition.z-uLightLineTime)*(-2.0*vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;
        if(LightLineMix>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(0.8,1.0,0.0,1),LightLineMix /uLightLineWidth);
        }
        `
    );
    gsap.to(shader.uniforms.uLightLineTime,{
        value:1500,
        duration:5,
        ease:'none',
        repeat:-1,
    })
};

export function addTopLine(shader){
    shader.uniforms.uTopLineTime = {value:0};
    shader.uniforms.uTopLineWidth = {value:50};
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
            #include <common>
            uniform float uTopLineTime;
            uniform float uTopLineWidth;
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        float topMix = -(vPosition.y-uTopLineTime)*(vPosition.y-uTopLineTime)+uTopLineWidth;
        if(topMix>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(1.0,0.5,0.5,1.0),topMix/uTopLineWidth);
        }
        `
    );
    gsap.to(shader.uniforms.uTopLineTime,{
        value:500,
        duration:3,
        ease:'none',
        repeat:-1
    })
}

