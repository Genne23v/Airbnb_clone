const HTTP_PORT = process.env.PORT || 8080;
const express = require('express'),
    app = express();


app.get('/', (req, res) => {
    res.send('Welcome to my home!');
});

app.get('/myimage', (req, res) => {
    res.send('This is my image page');
});

app.get('/info', (req, res) => {
    res.send('This is my info page');
})

app.listen(HTTP_PORT, () => {
    console.log(`The server is running... to port ${HTTP_PORT}`);
});