import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000
const MESSAGE = process.env.MESSAGE

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logFilePath = path.join(__dirname, 'files', 'logs.txt')
const countFilePath = path.join(__dirname, 'files', 'count.txt')
const informationPath = path.join(__dirname, 'config', 'information.txt')

console.log('env variable MESSAGE: ', MESSAGE)

app.get('/healthz', async (req,res) => {
    try {
        await axios.get('http://pingpong-svc:80/pings')
        res.sendStatus(200)
    } catch (error) {
        console.log('Error occured: ', error.message)
        res.sendStatus(500)
    }
})


app.get('/', async (req, res) => {

    const randomString = await fs.readFile(logFilePath, 'utf8')
        .then((data) => {
            console.log('random string found: ', data)
            return data
        })
        .catch((err) => console.log('Error occured reading random string data: ', err))

    console.log('trying to find configmap file')

    const configMapText = await fs.readFile(informationPath, 'utf8')
        .then((data) => {
            console.log('file found with data: ', data)
            return data
        })
        .catch((err) => console.log('Error occured reading confimapfile: ', err))

    console.log('trying to find count via network')

    const response = await axios.get('http://pingpong-svc:80/pings')

    console.log('count found: ', response.data)
    
    // const pingpongCount = await fs.readFile(countFilePath, 'utf8')
    //     .then((data) => {
    //         console.log('count data found: ', data)
    //         return data
    //     })
    //     .catch((err) => console.log('Error occured reading count data: ', err))

    res.send(`
        <div>
            <p>file content: ${configMapText}</p>
            <p>env variable: MESSAGE=${MESSAGE}</p>
            <p>${randomString}</p>
            <p>Ping / Pongs: ${response.data}</p>
        </div>
        `     
    )
    
})

 app.listen(PORT, () => {

    console.log(`Server started in port ${PORT}`)
})

