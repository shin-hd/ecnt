import {
  createSticker,
  deleteStickers,
  loadStickers,
  saveStickers,
} from './stickerList.js';

const createButton = document.querySelector('#header-wrapper .btns .create');
const deleteButton = document.querySelector('#header-wrapper .btns .delete');

createButton.addEventListener('click', createSticker);
deleteButton.addEventListener('click', deleteStickers);

window.addEventListener('beforeunload', saveStickers);
window.addEventListener('load', loadStickers);
