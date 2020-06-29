require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/users', (req, res) => {
    res.json('Hello world');
});

app.get('/user/:id', (req, res) => {
    res.json('search by id');
})

app.post('/user', (req, res) => {
    let body = req.body;
    res.json({
        user: body
    });
});

app.put('/user/:id', (req, res) => {
    res.json('put');
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        user: 'Oscar',
        id
    });
});

app.listen(process.env.PORT);