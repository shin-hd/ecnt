import Item from './item.js';
import { getRandomBrightColor } from './utils/color.js';

export default class Sticker {
  itemList = [];

  constructor({ name, top, left, onRemove }) {
    this.name = name;
    this.top = top;
    this.left = left;
    this.dom = this.createDom();
    this.remove = () => {
      onRemove?.(this);
      this.dom?.box.remove();
    };
  }

  createDom = () => {
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
    // 스티커명 입력
    nameInput.type = 'text';
    nameInput.maxLength = 10;
    nameInput.value = this.name ?? 'sticker';
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

    // 아이템리스트
    const ul = document.createElement('ul');
    ul.className = 'last-margin-none';

    // 추가/삭제 버튼
    const createButton = document.createElement('button');
    createButton.className = 'btn-small margin-right';
    createButton.innerText = '항목 추가';
    createButton.addEventListener('click', () => {
      const item = new Item({
        onRemove: (item) => {
          const index = this.itemList.indexOf(item);
          this.itemList.splice(index, 1);
        },
      });
      ul.appendChild(item.getDom());
      this.itemList.push(item);
      item.focusInput();
    });
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-middle';
    deleteButton.innerText = '스티커 삭제';
    deleteButton.addEventListener('click', () => {
      if (confirm(`${this.name} 스티커를 삭제하시겠습니까?`)) box.remove();
    });
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'btns margin-bottom flex';
    buttonsDiv.appendChild(createButton);
    buttonsDiv.appendChild(deleteButton);

    // 스티커 박스
    const box = document.createElement('div');
    box.style.backgroundColor = getRandomBrightColor();
    box.className = 'box round outline';
    box.addEventListener('mouseenter', (e) => {
      box.parentNode.appendChild(box);
    });
    box.appendChild(nameDiv);
    box.appendChild(buttonsDiv);
    box.appendChild(ul);

    return { box, ul, nameInput };
  };

  focusInput = () => this.dom?.nameInput?.focus();
}
