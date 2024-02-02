require('dotenv').config();

const mysql = require('mysql');

const { HOST, DB_USER, PASSWORD, DATABASE } = process.env;

//db 연결 설정
const conn = mysql.createConnection({
  host: HOST,
  user: DB_USER,
  password: PASSWORD,
  database: DATABASE,
});

conn.connect((err) => {
  if (err) {
    console.error('DB 연결 오류:', err);
  } else {
    console.log('DB 연결 성공');
  }
});

//조회쿼리
exports.getAllBlocking = (callback) => {
  conn.query('select * from blocking', (err, rows) => {
    if (err) {
      console.error(err);
      callback({ result: false, msg: err });
    } else {
      callback(rows);
    }
  });
};

//POST
exports.postBlocking = (data, callback) => {
  const { name } = data;

  if (name.length > 20)
    return callback({
      result: false,
      msg: '확장자 최대 길이는 20자리 입니다.',
    });

  // 첫 번째 쿼리 실행: 모든 데이터 가져오기
  conn.query('select * from blocking', (err, rows) => {
    if (err) {
      console.error(err);
      callback({ result: false, msg: err });
    } else {
      if (rows.length >= 200)
        return callback({
          result: false,
          msg: '최대 확장자 차단의 갯수가 초과되었습니다.',
        });
      conn.query(
        `insert into blocking values(null, "${name}")`,
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              // 중복값
              callback({ result: false, msg: '중복된 확장자입니다.' });
            } else {
              console.error(err);
              callback({ result: false, msg: err });
            }
          } else {
            callback({ result: true, msg: '성공' });
          }
        }
      );
    }
  });
};
