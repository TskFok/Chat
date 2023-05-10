import axios from 'axios'

const SendRequest = axios.create({
    baseURL: import.meta.env.VITE_API,
    timeout: 2000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default SendRequest