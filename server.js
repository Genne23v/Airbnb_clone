const HTTP_PORT = process.env.PORT || 8080;
const express = require('express'),
    app = express();


app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(HTTP_PORT);