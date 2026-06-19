import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'


const app = express()
const PORT = process.env.PORT || 3001

// const directory = path.join('/', 'usr', 'src', 'app', 'files')
// const filePath = path.join(directory, 'logs.txt')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logFilePath = path.join(__dirname, 'files', 'logs.txt')

const createDirIfNotExists = async (dir) => {
    await fs.access(dir)
        .then(() => undefined )
        .catch(() => {
            fs.mkdir(dir)})
}

const generateRandomString = async () => {

    createDirIfNotExists(__dirname)
    let currentString = ''
    const randomString = crypto.randomUUID()
    currentString = new Date + " : " + randomString
 
    await fs.appendFile(logFilePath, `${currentString}\r\n`, 'utf8')
        .then(console.log('Log entry added: ', currentString))
        .catch(err => console.log('Error occured adding log entry: ', err))
 
    setTimeout(generateRandomString, 5000)
}

 app.listen(PORT, () => {

    console.log(`Server started in port ${PORT}`)
    generateRandomString()
})

