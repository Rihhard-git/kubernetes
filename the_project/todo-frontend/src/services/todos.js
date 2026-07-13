import axios from 'axios'

const getAll = async () => {
    console.log('getting todos from backend')

    const res = await axios.get('/todos')
    return res.data
}
const create = async (todoObject) => {

    const res = await axios.post('/todos', todoObject)

    return res.data
}

const checkHealth = async () => {
    const res = await axios.get('/healthz')
    return res.data
}

const markDone = async (id, newObject) => {
    return await axios.put(`/todos/${id}`, newObject)

}

export default { getAll, create, checkHealth, markDone }