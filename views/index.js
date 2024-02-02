const $submitBtn = document.querySelector('.button');
const $extensionBlockingList = document.querySelector('.extension_list');
const $currentLength = document.querySelector('.current_length');
const $inputList = document.querySelectorAll('.input_list');

const BASE_URL = 'http://localhost:8001/blocking';

document.addEventListener('keypress', function (event) {
  // 엔터 키가 눌렸을 때 동작을 여기에 추가
  if (event.key === 'Enter') {
    document.getElementById('addButton').click(); // 버튼 클릭 이벤트 호출
  }
});

// return true, false를 넣은 것은 다음 로직을 실행하기 위함
async function createItemRequest(value) {
  try {
    const res = await axios.post(BASE_URL, {
      name: value,
    });
    const data = res.data;
    if (data.result) {
      addItem(value);
      getCurrentBlockingLength('plus');
      return true;
    } else {
      alert(data.msg);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

// return true, false를 넣은 것은 다음 로직을 실행하기 위함
async function deleteItemRequest(value) {
  try {
    const res = await axios.delete(BASE_URL, {
      data: { name: value },
    });
    const data = res.data;
    if (data.result) {
      deleteItem(value);
      getCurrentBlockingLength('minus');
      return true;
    } else {
      alert(data.msg);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

// change 이벤트를 통해 db에 값 저장
$inputList.forEach((item) => {
  item.addEventListener('change', async (e) => {
    if (e.target.checked) {
      // 체크 되었을 때만 저장
      const result = await createItemRequest(e.target.value);
      if (!result) return (item.checked = false);
    } else {
      // 체크 해제시 삭제
      await deleteItemRequest(e.target.value);
    }
  });
});

// 텍스트로 추가
$submitBtn.addEventListener('click', async () => {
  const $input = document.querySelector('.input_value');
  const value = $input.value;
  if (value.trim().length !== 0) {
    const result = await createItemRequest(value);
    $input.value = '';
    $input.focus();

    if (!result) return;
    $inputList.forEach((item) => {
      // 텍스트로 추가할 때 체크박스에 해당 확장자 있으면 체크 표시
      if (item.value === value) {
        item.checked = true;
      }
    });
  } else {
    alert('빈 문자입니다. 다시 입력해주세요!');
  }
});

// 현재 개수 수정 함수
function getCurrentBlockingLength(operator) {
  if (operator === 'plus') {
    $currentLength.textContent = Number($currentLength.textContent) + 1;
  } else if (operator === 'minus') {
    $currentLength.textContent = Number($currentLength.textContent) - 1;
  }
}

function onClickDeleteItem($btn) {
  $btn.addEventListener('click', async () => {
    const value = $btn.parentNode.children[0].textContent; // 버튼 부모요소의 1번째 자식으로 접근해서 값 가져오기

    const result = await deleteItemRequest(value);
    if (!result) return;

    $inputList.forEach((item) => {
      // 체크박스에 해당 값이 있으면 체크 해제
      if (item.value === value) {
        item.checked = false;
      }
    });
  });
}

function addItem(dbData) {
  const $div = document.createElement('div');
  const $span = document.createElement('span');
  const $btn = document.createElement('button');
  $div.classList = 'db_wrap';
  $btn.classList = 'db_btn';
  $span.classList = `db_${dbData}`;
  $btn.textContent = 'X';
  onClickDeleteItem($btn);

  $span.textContent = dbData;
  $div.appendChild($span);
  $div.appendChild($btn);
  $extensionBlockingList.appendChild($div);
}

function deleteItem(data) {
  const $element = document.querySelector(`.db_${data}`).parentNode;
  $element.remove();
}

// 바로 실행 함수,, 디비 값으로 초기 화면 만들어줌
(async function display() {
  try {
    const res = await axios.get(BASE_URL);
    const data = res.data;
    console.log(data);

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
