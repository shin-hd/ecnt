import Sticker from './sticker.js';
import { createSticker } from './stickerList.js';

const addButton = document.querySelector('#header-wrapper .btns .create');

addButton.addEventListener('click', () => createSticker());
