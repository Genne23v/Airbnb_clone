const HTTP_PORT = process.env.PORT || 8080;
const express = require('express'),
    app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.send('Welcome to my home!');
});

app.get('/registration', (req, res) => {
    res.send('This is my registration page');
});

app.get('/room_listing', (req, res) => {
    res.send('This is the result of your search');
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT, () => {
    console.log(`The server is running... to port ${HTTP_PORT}`);
});


