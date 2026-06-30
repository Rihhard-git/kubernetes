import express from 'express'

const app = express()
const PORT = 3000

let pingpong = 0;

app.get('/', (req, res) => {
    pingpong++;
    res.status(200).send(`pong ${pingpong}`)  

})
//app.get('/', (req, res) => res.status(200).send('Health check ok!'))

app.get('/pings', (req, res) => {

    console.log('sending pings to logger')
    res.send(pingpong)
})
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
