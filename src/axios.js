import axios from 'axios';

const Instance = axios.create({
    baseUrl: 'http://localhost:4444'
})

axios.get('/posts')

export default Instance
