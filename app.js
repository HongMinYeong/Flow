const express = require('express');
const multer = require('multer');

const app = express();
const PORT = 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('views'));

// multer 설정
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(`File uploaded:${req.file.originalname}`);

  res.send('File uploaded successfully.');
});

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
