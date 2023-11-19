import {
  createSticker,
  deleteStickers,
  getStickerByDom,
  loadStickers,
  saveStickers,
} from './stickerMap.js';
import {
  boxDropDownEventHandler,
  itemDropDownEventHandler,
} from './utils/dropdown.js';

const createButton = document.querySelector('#header-wrapper .btns .create');
const deleteButton = document.querySelector('#header-wrapper .btns .delete');
const stickerWrapper = document.querySelector('#sticker-wrapper');

createButton.addEventListener('click', () => createSticker(stickerWrapper));
deleteButton.addEventListener('click', deleteStickers);

stickerWrapper.addEventListener('mousedown', (e) => {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLButtonElement
  )
    return;

  e.target.classList.contains('item-child')
    ? itemDropDownEventHandler(e, getStickerByDom)
    : boxDropDownEventHandler(e);
});
stickerWrapper.ondragstart = () => false;

window.addEventListener('beforeunload', saveStickers);
window.addEventListener('load', () => loadStickers(stickerWrapper));
