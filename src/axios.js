import axios from 'axios';

const Instance = axios.create({
    baseURL: 'http://localhost:4444'
})

export default Instance
