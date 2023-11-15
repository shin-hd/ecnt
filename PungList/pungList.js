const LI_CLASSES = 'flex margin-child center';
const LI_NAME = 'name';
const LI_TIME = 'time';
const LI_ADD_TIME_BUTTON = 'small add-time';
const LI_STOP_BUTTON = 'small stop';
const LI_REMOVE_BUTTON = 'small remove';

const inputText = document.querySelector('#header-wrapper #inputs #text');
const inputButtons = document.querySelector(
  '#header-wrapper #inputs #input-btns',
);

const itemCount = document.querySelector('#item-count');
const avgTime = document.querySelector('#average-time');

const resetButton = document.querySelector('#create-btns #reset');
const doubleButton = document.querySelector('#create-btns #double');
const plusButton = document.querySelector('#create-btns #plus');
const stopButton = document.querySelector('#create-btns #stop');
const startButton = document.querySelector('#create-btns #start');

const itemList = document.querySelector('#item-wrapper #item-list');

const getNewId = (function () {
  let id = 1;
  return () => id++;
})();

const sortItems = () => {
  [...itemList.children]
    .sort((a, b) => (a.time > b.time ? 1 : -1))
    .forEach((item) => itemList.appendChild(item));
};

const findItemsInfo = () => {
  itemCount.innerText = `${itemList.children.length} 건`;
  const sum =
    itemList.children.length == 0
      ? 0
      : [...itemList.children]
          .map((item) => item.time)
          .reduce((prev, cur) => prev + cur);
  const average =
    itemList.children.length == 0 ? 0 : sum / itemList.children.length;
  avgTime.innerText = `${Math.round(average * 10) / 10} 초`;
};

const createItem = (text, time) => {
  const id = getNewId();
  const li = document.createElement('li');
  li.setAttribute('id', `item-${id}`);
  li.setAttribute('class', LI_CLASSES);

  const divName = document.createElement('div');
  divName.setAttribute('class', 'name');
  divName.innerText = text;
  li.appendChild(divName);

  const divTime = document.createElement('div');
  divTime.setAttribute('class', 'time');
  divTime.innerText = `${time}초`;
  li.appendChild(divTime);

  const divButtons = document.createElement('div');
  divButtons.setAttribute('class', 'flex btn-wrapper');

  const addTimeButton = document.createElement('button');
  addTimeButton.setAttribute('class', LI_ADD_TIME_BUTTON);
  addTimeButton.innerText = '+5초';
  addTimeButton.addEventListener('click', () => li.addTime());
  divButtons.appendChild(addTimeButton);

  const stopButton = document.createElement('button');
  stopButton.setAttribute('class', LI_STOP_BUTTON);
  stopButton.innerText = '중지';
  stopButton.addEventListener('click', () => {
    if (li.pause) li.startItem();
    else li.pauseItem();
  });
  divButtons.appendChild(stopButton);

  const removeButton = document.createElement('button');
  removeButton.setAttribute('class', LI_REMOVE_BUTTON);
  removeButton.innerText = '삭제';
  removeButton.addEventListener('click', () => {
    li.remove();
    findItemsInfo();
  });
  divButtons.appendChild(removeButton);

  li.appendChild(divButtons);

  li.text = text;
  li.time = time;
  li.pause = false;
  li.pauseItem = () => {
    li.pause = true;
    stopButton.innerText = '시작';
  };
  li.startItem = () => {
    li.pause = false;
    stopButton.innerText = '중지';
    li.run();
  };
  li.run = () => {
    if (li.pause) return;

    const divTime = li.querySelector('.time');
    if (li.time > 1) {
      li.time--;
      divTime.innerText = `${li.time}초`;

      setTimeout(li.run, 1000);
    } else {
      li.remove();
    }
    findItemsInfo();
  };
  li.addTime = () => {
    li.time = li.time + 5;
    divTime.innerText = `${li.time}초`;
  };

  return li;
};

const setItem = (item) => {
  setTimeout(item.run, 1000);
  itemList.appendChild(item);
  findItemsInfo();
  sortItems();
};

inputButtons.addEventListener('click', (e) => {
  const time = +e.target.value;
  const text = inputText.value;
  if (!time || !text) return;

  const li = createItem(text, time);
  setItem(li);
});

resetButton.addEventListener('click', () => {
  [...itemList.children].forEach((item) => item.remove());
});

doubleButton.addEventListener('click', () => {
  if (itemList.children.length >= 15) {
    alert('더 이상 Pung을 추가할 수 없습니다.');
    return;
  }
  [...itemList.children]
    .map((item) => createItem(item.text, item.time))
    .forEach((item) => setItem(item));
  sortItems();
});

plusButton.addEventListener('click', () => {
  [...itemList.children].forEach((item) => item.addTime());
});

stopButton.addEventListener('click', () => {
  [...itemList.children].forEach((item) => item.pauseItem());
});

startButton.addEventListener('click', () => {
  [...itemList.children]
    .filter((item) => item.pause)
    .forEach((item) => item.startItem());
});

setInterval(sortItems, 1000);
