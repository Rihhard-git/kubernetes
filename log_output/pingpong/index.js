import express from 'express'
import { Pool } from 'pg'

const app = express()
const PORT = process.env.PORT || 3000

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL
})

let ready = false

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const init = async () => {

    while (!ready) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS pingpong (
                id SERIAL PRIMARY KEY,
                count INTEGER NOT NULL DEFAULT 0
                )
            `)
            await pool.query(`
                INSERT INTO pingpong (id, count)
                VALUES (1,0)
                ON CONFLICT (id) DO NOTHING`)
            ready = true
            console.log('DB initialized')
        } catch (err) {
            console.log('DB not ready, retrying...', err.message)
            await sleep(2000)
        }
    }    
}

app.get('/', async (req, res) => {

    const result = await pool.query(`
        UPDATE pingpong
        SET count = count + 1
        WHERE id = 1
        RETURNING count
        `)

    res.status(200).send(`pong ${result.rows[0].count}`)  

})

app.get('/pings', async (req, res) => {

    const result = await pool.query(`
        SELECT count
        FROM pingpong
        WHERE id = 1
        `)
    res.send(result.rows[0].count)
})

app.get('/healthz', async (req, res) => {
    try {
        await pool.query('SELECT 1')
        res.send('ok')
    } catch {
        ready = false
        res.status(500).send('db error')
        init()
    }
})


init()

app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})


