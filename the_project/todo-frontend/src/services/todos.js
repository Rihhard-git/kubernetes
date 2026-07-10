import axios from 'axios'

const getAll = async () => {
    console.log('getting todos from backend')

    const res = await axios.get('/todos')
    return res.data
}
const create = (todoObject) => {
    console.log('creating new todo')

    const res = axios.post('/todos', todoObject)
    return res.data
}

const checkHealth = async () => {
    const res = await axios.get('/healthz')
    return res.data
}

export default { getAll, create, checkHealth }