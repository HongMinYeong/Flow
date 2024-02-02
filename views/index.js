const $submitBtn = document.querySelector('.button');
const $extensionBlockingList = document.querySelector('.extension_list');
const $currentLength = document.querySelector('.current_length');
const $inputList = document.querySelectorAll('.input_list');

const BASE_URL = 'http://localhost:8001/blocking';

// 바로 실행 함수,, 디비 값으로 초기 화면 만들어줌
(async function display() {
  try {
    const res = await axios.get(BASE_URL);
    const data = res.data;

    // db에 있는 값이면 체크박스에 표시
    $inputList.forEach((item) => {
      data.forEach((dbItem) => {
        if (item.value === dbItem.extension) item.checked = true;
      });
    });

    // db값 UI 그리기
    $currentLength.textContent = data.length;
    data.forEach((item) => {
      addItem(item.extension);
    });
  } catch (err) {
    console.error(err);
  }
})();
