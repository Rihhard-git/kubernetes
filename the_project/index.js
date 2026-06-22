import express from 'express'
import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const directory = path.join(__dirname, 'files')
const imagePath = path.join(directory, 'image.jpg')
const logPath = path.join(directory, 'log.txt')



const fileExists = async (filePath) => new Promise(res => {

    fs.stat(filePath, (err, stats) => {
         if (err || !stats) return res(false)
         return res(true)
    })
}) 


const findFile = async () => {

    if (await fileExists(imagePath)) return



    await new Promise(res => fs.mkdir(directory, (err) => res()))   
    const response = await axios.get('https://loremflickr.com/600/400/landscape', { responseType: 'stream'})
    response.data.pipe(fs.createWriteStream(imagePath))
 
    const date = new Date().toISOString()

    await new Promise(res => fs.writeFile(logPath, date, 'utf8', (err) => res()))
    console.log('writing done.')

}

const calculateTimeDifference = async () => {

    if (!await fileExists(logPath)) return

    const lastTimeStamp = await fsp.readFile(logPath, 'utf8')
            .then((data) => {
                console.log('random string found: ', data)
                return data
            })
            .catch((err) => console.log('Error occured reading random string data: ', err))

    const timeDifferenceInMinutes = (new Date().getTime() - new Date(lastTimeStamp).getTime())/60000
    return timeDifferenceInMinutes
}

const removeFile = async () => new Promise(res => fs.unlink(imagePath, (err) => res()))


app.use( express.static('files' ))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {


    res.render('index')
    if (await calculateTimeDifference() > 10) {
        console.log('removing old img')
        removeFile()
        console.log('remove id one, finding new image')
        findFile()
        console.log('new image found and saved')
    }  

})

findFile()

app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`)
    
})