import axios from 'axios';

const axiosClient = axios.create({
    baseURL:'https://catcode-server.vercel.app',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
});

export default axiosClient;