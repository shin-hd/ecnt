export const boxDropDownEventHandler = (e) => {
  const boxEl = e.target.closest('.box');
  if (!boxEl) return;

  const boxRect = boxEl.getBoundingClientRect();
  const shiftX = e.clientX - boxRect.left;
  const shiftY = e.clientY - boxRect.top;

  const onMouseMove = (moveEvent) => {
    boxEl.style.left = moveEvent.clientX - shiftX + 'px';
    boxEl.style.top = moveEvent.clientY - shiftY + 'px';
  };

  const onMouseUp = () => {
    boxEl.removeEventListener('mousemove', onMouseMove);
    boxEl.removeEventListener('mouseup', onMouseUp);
  };

  boxEl.addEventListener('mousemove', onMouseMove);
  boxEl.addEventListener('mouseup', onMouseUp);
};

export const itemDropDownEventHandler = (e, getStickerByDom) => {
  const boxEl = e.target.closest('.box');
  const itemEl = e.target.closest('.item');
  if (!itemEl) return;

  const sticker = getStickerByDom(boxEl);
  const item = sticker.getItemByDom(itemEl);

  const boxRect = boxEl.getBoundingClientRect();
  const itemRect = itemEl.getBoundingClientRect();

  const left = itemRect.left - boxRect.left;
  const top = itemRect.top - boxRect.top;

  itemEl.style.left = left + 'px';
  itemEl.style.top = top + 'px';
  itemEl.style.zIndex = '1000';
  itemEl.classList.add('absolute');

  const shadow = document.createElement('div');
  shadow.className = 'item-shadow margin-bottom-10 round';
  itemEl.parentNode.insertBefore(shadow, itemEl);

  const shiftX = e.clientX - left;
  const shiftY = e.clientY - top;

  const onMouseMove = (moveEvent) => {
    itemEl.style.left = moveEvent.clientX - shiftX + 'px';
    itemEl.style.top = moveEvent.clientY - shiftY + 'px';
  };

  const onMouseUp = (upEvenet) => {
    itemEl.style.zIndex = '';
    const box = document
      .elementsFromPoint(upEvenet.clientX, upEvenet.clientY)
      .find(
        (element) => element.classList.contains('box') && element !== boxEl,
      );
    if (box) {
      const sticker = getStickerByDom(box);
      sticker.addItem(item);
    }
    shadow.remove();
    itemEl.classList.remove('absolute');
    itemEl.removeEventListener('mousemove', onMouseMove);
    itemEl.removeEventListener('mouseup', onMouseUp);
  };

  itemEl.addEventListener('mousemove', onMouseMove);
  itemEl.addEventListener('mouseup', onMouseUp);
};
