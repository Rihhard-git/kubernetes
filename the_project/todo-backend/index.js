import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

let todos = [
    {
        title: "Finish DevOps with Kubernetes 2026"
    },
    {
        title: "FullStack Open 2026"
    },
    {
        title: "FullStack Project"
    }
]

app.get('/todos', (req,res) => res.send(todos))

app.post('/todos', (req, res) => {
    console.log(req)
    const todo = req.body
    console.log(todo)
    if (todo) {
        todos.push(todo)
    }
    res.status(201).json(todo)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})