import Sticker from './sticker.js';

const STICKERS_KEY = 'stickers';

const stickerMap = new Map();

export const getStickerByDom = (boxEl) => stickerMap.get(boxEl);

export const deleteStickers = () => {
  for (const sticker of stickerMap.values()) {
    sticker.remove();
  }
};

const onRemove = (sticker) => stickerMap.delete(sticker.getDom());

export const createSticker = (stickerWrapper) => {
  const sticker = new Sticker({
    onRemove,
  });
  stickerWrapper.appendChild(sticker.getDom());
  stickerMap.set(sticker.getDom(), sticker);
  sticker.focusInput();
};

export const saveStickers = () => {
  const stickerList = [];
  for (const sticker of stickerMap.values()) {
    stickerList.push(sticker.serialize());
  }
  const stringifiedStickers = JSON.stringify(stickerList);
  localStorage.setItem(STICKERS_KEY, stringifiedStickers);
};

export const loadStickers = (stickerWrapper) => {
  const stringifiedStickers = localStorage.getItem(STICKERS_KEY);

  const stickerList = JSON.parse(stringifiedStickers).map(
    (sticker) => new Sticker({ ...sticker, onRemove }),
  );

  stickerList.forEach((sticker) => {
    stickerWrapper.appendChild(sticker.getDom());
    stickerMap.set(sticker.getDom(), sticker);
  });
};
