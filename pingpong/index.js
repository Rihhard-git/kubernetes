import express from 'express'

const app = express()
const PORT = 3000

let pingpong = 0;

app.use('/pingpong', (req, res) => {
    pingpong++;
    res.send(`pong ${pingpong}`)  

})
app.use('/pings', (req, res) => {
    res.send(pingpong)
})
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
})
