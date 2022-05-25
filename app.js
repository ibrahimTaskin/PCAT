const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');

const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  console.log(photos);
  res.render('index',{
    photos
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photo/:id', async (req, res) => {  
  const photo = await Photo.findById(req.params.id); // id ile fotoyu bul
  res.render('photo',{photo}); // gönder
});

// catch action
app.post('/photos', async(req, res) => {
  await Photo.create(req.body);  
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatıldı`);
});
