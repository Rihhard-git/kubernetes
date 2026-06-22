import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logFilePath = path.join(__dirname, 'files', 'logs.txt')
const countFilePath = path.join(__dirname, 'files', 'count.txt')


app.get('/', async (req, res) => {

    const randomString = await fs.readFile(logFilePath, 'utf8')
        .then((data) => {
            console.log('random string found: ', data)
            return data
        })
        .catch((err) => console.log('Error occured reading random string data: ', err))

    console.log('trying to find count via network')

    const response = await axios.get('http://pingpong-svc:2345/pings')

    console.log('count found: ', response.data)
    
    // const pingpongCount = await fs.readFile(countFilePath, 'utf8')
    //     .then((data) => {
    //         console.log('count data found: ', data)
    //         return data
    //     })
    //     .catch((err) => console.log('Error occured reading count data: ', err))

    res.send(`
        <div>
            <p>${randomString}</p>
            <p>Ping / Pongs: ${response.data}</p>
        </div>
        `     
    )
    
})

 app.listen(PORT, () => {

    console.log(`Server started in port ${PORT}`)
})

