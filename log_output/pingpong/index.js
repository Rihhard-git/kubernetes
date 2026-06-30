import express from 'express'

const app = express()
const PORT = 3000

let pingpong = 0;

app.get('/pingpong', (req, res) => {
    console.log('doing some pingpong action')

    pingpong++;
    res.send(`pong ${pingpong}`)  

})
app.get('/', (req, res) => res.status(200).send('Health check ok!'))

app.get('/pings', (req, res) => {

    console.log('sending pings to logger')
    res.send(pingpong)
})
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
