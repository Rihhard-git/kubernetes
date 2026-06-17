import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

let count = 0;

app.use('/pingpong', (req, res) => {
    res.send(`pong ${count}`)
    count++;
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))