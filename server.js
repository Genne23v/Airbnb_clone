const HTTP_PORT = process.env.PORT || 8080;
const express = require('express'),
    app = express(),
    exphbs = require('express-handlebars');


app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');    

app.get('/', (req, res) => {
    res.render('home');
    res.send('Welcome to Airbnb home!');
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


