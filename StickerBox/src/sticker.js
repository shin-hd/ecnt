import Item from './item.js';
import { getRandomBrightColor } from './utils/color.js';

const getNextTop = (() => {
  let top = 50;
  return () => {
    const curTop = top;
    if (top > document.documentElement.scrollHeight - 200) top = 50;
    else top += 50;
    return curTop;
  };
})();
const getNextLeft = (() => {
  let left = 20;
  return () => {
    const curLeft = left;
    left = left + 10;
    return curLeft;
  };
})();

export default class Sticker {
  itemMap = new Map();

  constructor({
    name = null,
    items = [],
    top = getNextTop(),
    left = getNextLeft(),
    color = null,
    onRemove = () => {},
  }) {
    this.name = name;
    this.dom = this.createDom(top, left, color);
    this.remove = () => {
      onRemove(this);
      this.dom?.box.remove();
    };
    this.createItemMap(items);
  }

  createDom = (top, left, color) => {
    const nameInput = document.createElement('input');
    const nameH2 = document.createElement('h2');
    const switchHidden = () => {
      nameInput.classList.toggle('hidden');
      nameInput.classList.toggle('flex');
      nameH2.classList.toggle('hidden');
      nameH2.classList.toggle('flex');
      nameH2.innerText = nameInput.value;
      this.name = nameInput.value;
    };
    // 스티커명 input
    nameInput.type = 'text';
    nameInput.maxLength = 15;
    nameInput.value = this.name ?? 'sticker';
    nameInput.name = 'sticker';
    nameInput.classList.add('height-32');
    nameInput.classList.add('text-16');
    nameInput.classList.add(this.name ? 'hidden' : 'flex');
    nameInput.addEventListener(
      'input',
      (e) => (nameH2.innerText = e.target.value),
    );
    nameInput.addEventListener('focusout', () =>
      nameInput.value ? switchHidden() : nameInput.focus(),
    );
    // 스티커명 h2
    nameH2.innerText = this.name ?? '';
    nameInput.classList.add('height-32');
    nameH2.classList.add(this.name ? 'flex' : 'hidden');
    nameH2.addEventListener('click', () => {
      switchHidden();
      nameInput.focus();
    });
    // 스티커명 div
    const nameDiv = document.createElement('div');
    nameDiv.className = 'flex';
    nameDiv.appendChild(nameInput);
    nameDiv.appendChild(nameH2);

    // 아이템 리스트
    const ul = document.createElement('ul');
    ul.className = 'last-margin-none';

    // 추가/삭제 버튼
    const createButton = document.createElement('button');
    createButton.className = 'btn-small margin-right';
    createButton.innerText = '항목 추가';
    createButton.addEventListener('click', () => {
      const item = new Item({
        onRemove: (item) => this.itemMap.delete(item.getDom()),
      });
      ul.appendChild(item.getDom());
      this.itemMap.set(item.getDom(), item);
      item.focusInput();
    });
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-middle';
    deleteButton.innerText = '스티커 삭제';
    deleteButton.addEventListener('click', () => {
      if (confirm(`${this.name} 스티커를 삭제하시겠습니까?`)) this.remove();
    });
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'btns margin-bottom flex';
    buttonsDiv.appendChild(createButton);
    buttonsDiv.appendChild(deleteButton);

    // 스티커 박스
    const box = document.createElement('div');
    box.style.backgroundColor = color ?? getRandomBrightColor();
    box.style.top = top + 'px';
    box.style.left = left + 'px';
    box.className = 'box round outline';
    box.addEventListener('mouseenter', () => box.parentNode.appendChild(box));
    box.appendChild(nameDiv);
    box.appendChild(buttonsDiv);
    box.appendChild(ul);

    return { box, ul, nameInput };
  };

  focusInput = () => this.dom.nameInput.focus();

  createItemMap = (items) => {
    items
      .map(
        (item) =>
          new Item({
            ...item,
            onRemove: (item) => this.itemMap.delete(item.getDom()),
          }),
      )
      .forEach((item) => {
        this.itemMap.set(item.getDom(), item);
        this.dom.ul.appendChild(item.getDom());
      });
  };

  getDom = () => this.dom.box;

  getItemByDom = (itemEl) => this.itemMap.get(itemEl);

  addItem = (item) => {
    this.dom.ul.appendChild(item.getDom());
    this.itemMap.set(item.getDom(), item);
  };

  serialize = () => {
    const boxRect = this.dom.box.getBoundingClientRect();
    return {
      name: this.name,
      top: boxRect.top,
      left: boxRect.left,
      color: this.dom.box.style.backgroundColor,
      items: this.getSerializedItemList(),
    };
  };

  getSerializedItemList = () => {
    const serializedItemList = [];
    for (const itemEl of this.dom.ul.children) {
      serializedItemList.push(this.itemMap.get(itemEl).serialize());
    }
    return serializedItemList;
  };
}
