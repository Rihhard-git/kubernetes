import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const directory = path.join(__dirname, 'files')
const countFilePath = path.join(directory, 'count.txt')

let count = 0

const createDirIfNotExists = async (dir) => {
    await fs.access(dir)
        .then(() => console.log('access ok') )
        .catch(() => {
            fs.mkdir(dir)})
}
console.log('creating directory and file')
await createDirIfNotExists(directory)

fs.writeFile(countFilePath, count.toString(), 'utf8')
        .then(() => undefined)
        .catch(err => console.log('Error writing to file: ', err))

console.log('directory and file created')

app.use('/pingpong', async (req, res) => {

    console.log(directory)

    count++;

    fs.writeFile(countFilePath, count.toString(), 'utf8')
        .then(() => undefined)
        .catch(err => console.log('Error writing to file: ', err))

    res.send(`pong ${count}`)
    
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})