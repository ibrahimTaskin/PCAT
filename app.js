const express = require('express');

const app = express();
app.use(express.static('public'));

const port = 3000;

app.get('/', (req, res) => {
  const blog = { id: 1, title: 'Blog title', description: 'Blog description' };
  res.send(blog);
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatıldı`);
});
