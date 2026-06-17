let currentString = ''

const generateRandomString = () => {

    const randomString = crypto.randomUUID()
    currentString = new Date + " : " + randomString
    console.log(currentString)
    setTimeout(generateRandomString, 5000)
}

import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send(currentString)
})


app.listen(PORT, () => {

    console.log(`Server started in port ${PORT}`)
    generateRandomString()
})

