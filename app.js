const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const Photo = require('./models/Photo');
const req = require('express/lib/request');

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
app.use(fileUpload());

const port = 3000;

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-date');

  res.render('index', {
    photos,
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
  res.render('photo', { photo }); // gönder
});

// catch action
app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir))
    // eğer bu klasör yoksa
    fs.mkdirSync(uploadDir);

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  // Use the mv() method to place the file somewhere on your server
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatıldı`);
});
