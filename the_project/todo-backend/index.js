import express from 'express'
import { Pool } from 'pg'
import morgan from 'morgan'

// Added comment to test that workflows work.

const app = express()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL
})

let ready = false
let isHealthy = true

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const init = async () => {

    while (!ready) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                done BOOLEAN DEFAULT false
                )
            `)
            await pool.query(`
                INSERT INTO todos (text)
                SELECT $1
                WHERE NOT EXISTS (
                SELECT 1 FROM todos WHERE text = $1)
                `, ['Learn DevOps With Kubernetes'])
            ready = true
            console.log('DB initialized')
        } catch (err) {
            console.log('DB not ready, retrying...', err.message)
            await sleep(2000)
        }
    }    
}

app.use(express.json())
morgan.token('data', (req, res) => {

    return JSON.stringify(req.body);
})

app.use(morgan('[:date[iso]] -- :method :url -- DATA: :data -- STATUS: :status' ))

app.get('/healthz', async (req, res) => {

    if (!isHealthy) {
        return res.status(500).json({ status: "unhealthy"})
    }

    try {
        await pool.query('SELECT 1')
        res.status(200).json({ status: 'healthy'})
    } catch {
        ready = false
        res.status(500).send('db error')
        init()
    }
})
app.get('/livez', (req,res) => {
    if (!isHealthy) {
        return res.status(500).send('Backend is dead')
    }

    res.status(200).send('Backend is live')

})
app.get('/todos', async (req,res,) => {

    const result = await pool.query(`
        SELECT id, text, done
        FROM todos
        `)
    res.json(result.rows) 
})

app.post('/todos', async (req, res, next) => {

    try {
        const result = await pool.query(`
            INSERT INTO todos (text)
            VALUES ($1)
            RETURNING *`,
            [req.body.text]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        next(error)
    }
    
})
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { done } = req.body

    try {
        const result = await pool.query(`
        UPDATE todos
        SET done = $1
        WHERE id = $2
        RETURNING *`,
        [done, id])
        res.json(result.rows[0])
    } catch (error) {
        console.log('Something went wrong marking todo done: ', error.message)
    }   
})

app.post('/break', (req, res) => {
    console.log('Backend intentionally broken')
    isHealthy = false
    res.status(200).json({ message: 'Backend broken'})
})

init()

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

