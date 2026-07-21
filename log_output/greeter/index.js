import express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello from version 2')
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
});