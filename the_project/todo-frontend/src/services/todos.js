import axios from 'axios'

const getAll = () => {
    console.log('getting todos from backend')

    const req = axios.get('/todos')
    return req.then(res => res.data)
}
const create = (todoObject) => {
    console.log('creating new todo')

    const res = axios.post('/todos', todoObject)
    return res.data
}

export default { getAll, create }