import Sticker from './sticker';

const stickerWrapper = document.querySelector('#sticker-wrapper');

const stickerList = [];

stickerWrapper.addEventListener('mousedown', (e) => {
  const boxEl = e.target.closest('.box');
  if (!boxEl) return;

  const shiftX = e.clientX - boxEl.getBoundingClientRect().left;
  const shiftY = e.clientY - boxEl.getBoundingClientRect().top;

  const onMouseMove = (moveEvent) => {
    boxEl.style.left = moveEvent.pageX - shiftX + 'px';
    boxEl.style.top = moveEvent.pageY - shiftY + 'px';
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

stickerWrapper.ondragstart = () => false;

export const createSticker = () => {
  const sticker = new Sticker({
    top: 50,
    left: 20,
    onRemove: (sticker) => {
      const index = this.stickerList.indexOf(sticker);
      this.stickerList.splice(index, 1);
    },
  });
  stickerWrapper.appendChild(sticker?.dom?.box);
  sticker?.focusInput();
  stickerList.push(sticker);
  console.log(stickerList);
};

export const removeSticker = (sticker) => {
  sticker.remove();
};
