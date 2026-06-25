import express from 'express'
import { Sequelize, Model, DataTypes } from 'sequelize'

const app = express()
const PORT = process.env.PORT

const DATABASE_URL = process.env.DATABASE_URL
const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

class Todo extends Model {}
Todo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todo'
})

await Todo.sync()

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

app.get('/todos', async (req,res) => {
    const todos = await Todo.findAll()
    res.json(todos)
})

app.post('/todos', async (req, res) => {
    const todo = await Todo.create(req.body)
    res.status(201).json(todo)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})