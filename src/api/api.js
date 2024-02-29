import axios from 'axios'

export function getSmartCityInfo(){
    return axios.get('http://127.0.0.1:4523/m1/1885029-0-default/api/smartcity/info')
}
export function getSmartCityEventList(){
    return axios.get('http://127.0.0.1:4523/m1/1885029-0-default/api/smartcity/list')
}