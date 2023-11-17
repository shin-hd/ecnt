export default class Item {
  constructor({ content = null, onRemove }) {
    this.content = content;
    this.li = this.createDom();
    this.remove = () => {
      onRemove(this);
      this.li?.remove();
    };
  }

  createDom = () => {
    const contentInput = document.createElement('input');
    this.focusInput = () => contentInput.focus();
    const contentDiv = document.createElement('div');
    const switchHidden = () => {
      contentDiv.classList.toggle('flex');
      contentDiv.classList.toggle('hidden');
      contentInput.classList.toggle('flex');
      contentInput.classList.toggle('hidden');

      this.content = contentInput.value;
      contentDiv.innerText = contentInput.value;
    };

    // 내용 입력
    contentInput.type = 'text';
    contentInput.value = this.content ?? 'content';
    contentInput.maxLength = 12;
    contentInput.classList.add('padding');
    contentInput.classList.add(this.content ? 'hidden' : 'flex');
    contentInput.addEventListener(
      'input',
      () => (this.content = contentInput.value),
    );
    contentInput.addEventListener('focusout', () => {
      switchHidden();
    });

    // 내용 표시
    contentDiv.className = 'padding center overflow-ellipsis';
    contentDiv.classList.add(this.content ? 'flex' : 'hidden');
    contentDiv.innerText = this.content ?? '';
    contentDiv.addEventListener('click', () => switchHidden());

    // 삭제 버튼
    const removeButton = document.createElement('button');
    removeButton.className = 'btn-small btn-simple flex-4';
    removeButton.innerText = '삭제';
    removeButton.addEventListener('click', () => this.remove());

    // 아이템 li
    const li = document.createElement('li');
    li.className =
      'bg-gray flex space-between outline margin-bottom-10 height-40 round';
    li.appendChild(contentInput);
    li.appendChild(contentDiv);
    li.appendChild(removeButton);
    li.addEventListener('click', this.focusInput);
    return li;
  };

  getDom = () => this.li;

  focusInput = () => {};
}
