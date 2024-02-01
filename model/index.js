const mysql = require('mysql');

const { DB_ENV } = process.env;

// config.json 파일을 불러와서 DB 연결 정보를 제공
const config = require(__dirname + '/../config/config.json')[DB_ENV];
//db 연결 설정
const conn = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
});

conn.connect((err) => {
  if (err) {
    console.error('DB 연결 오류:', err);
  } else {
    console.log('DB 연결 성공');
  }
});
