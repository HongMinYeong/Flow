const express = require('express');

const app = express();
const PORT = 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('views'));

// [라우터 분리]
const indexRouter = require('./routes');
app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// api
app.post('/', (req, res) => {
  res.send('안뇽??');
});

app.listen(PORT, () => {
  console.log(`Port ${PORT} is opening`);
});
