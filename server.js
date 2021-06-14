const HTTP_PORT = process.env.PORT || 8080;
const express = require('express'),
    handlebars = require('express-handlebars'),
    path = require('path'),
    app = express();

app.use(express.static('public'));
app.set('view engine', 'hbs');    
app.engine('hbs', handlebars( { extname: 'hbs', defaultLayout: 'home', layoutDir: __dirname + '/views/layouts'}));

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'index'
    });
});

app.get('/registration', (req, res) => {
    res.render('registration', {
        layout: false
    });
});

app.get('/room-listing', (req, res) => {
    res.render('room-listing', {
        layout: 'index'
    });;
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT, () => {
    console.log(`The server is running... to port ${HTTP_PORT}`);
});


