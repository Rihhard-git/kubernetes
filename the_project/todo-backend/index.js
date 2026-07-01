import express from 'express'
import { Sequelize, Model, DataTypes } from 'sequelize'
import morgan from 'morgan'

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
        allowNull: false,
        validate: {
            len: [0, 140]
        }

    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todo'
})
await Todo.sync()

const errorHandler = (error, req, res, next) => {

    console.log(error)
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: error.message })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message })
    }
    if (error.name === 'TypeError') {
        return res.status(400).send({ error: error.message})
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).send({ error: error.message})
    }
    next(error)
}

app.use(express.json())
morgan.token('data', (req, res) => {

    return JSON.stringify(req.body);
})

app.use(morgan('[:date[iso]] -- :method :url -- DATA: :data -- STATUS: :status' ))

app.get('/', (req,res) => res.status(200).send('Health check ok!'))
app.get('/todos', async (req,res,) => {

    
    const todos = await Todo.findAll()
    res.json(todos) 

    
})

app.post('/todos', async (req, res, next) => {

    try {
        const todo = await Todo.create(req.body)
        res.status(201).json(todo)
    } catch (error) {
        next(error)
    }
    
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})