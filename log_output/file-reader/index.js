import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logFilePath = path.join(__dirname, 'files', 'logs.txt')


app.get('/', async (req, res) => {

    await fs.readFile(logFilePath, 'utf8')
        .then((data) => {
            console.log('data found: ', data)
            res.send(data)
        })
        .catch((err) => console.log('Error occured: ', err))
    
})

 app.listen(PORT, () => {

    console.log(`Server started in port ${PORT}`)
})

