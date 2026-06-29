import express from 'express'

const app = express()
const PORT = 3000

let pingpong = 0;

app.use('/pingpong', (req, res) => {
    console.log('doing some pingpong action')

    pingpong++;
    res.send(`pong ${pingpong}`)  

})
app.use('/', (req, res) => res.status(200).send('Health check ok!'))

app.use('/pings', (req, res) => {

    console.log('sending pings to logger')
    res.send(pingpong)
})
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
