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

const getTargetElements = (event, filterEl) => {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  const targetBoxEl = elements.find((element) =>
    element.classList.contains('box'),
  );
  const targetItemEl = elements.find(
    (element) => element.classList.contains('item') && element !== filterEl,
  );
  return [targetBoxEl, targetItemEl];
};

export const itemDropDownEventHandler = (downEvent, getStickerByDom) => {
  const boxEl = downEvent.target.closest('.box');
  const itemEl = downEvent.target.closest('.item');
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

  const shiftX = downEvent.clientX - left;
  const shiftY = downEvent.clientY - top;

  const onMouseMove = (moveEvent) => {
    itemEl.style.left = moveEvent.clientX - shiftX + 'px';
    itemEl.style.top = moveEvent.clientY - shiftY + 'px';

    if (
      Math.abs(downEvent.clientX - moveEvent.clientX) < 20 &&
      Math.abs(downEvent.clientY - moveEvent.clientY) < 20
    )
      return;

    const [targetBoxEl, targetItemEl] = getTargetElements(moveEvent, itemEl);
    if (targetItemEl) {
      const targetUl = getStickerByDom(targetBoxEl).dom.ul;
      targetItemEl.nextSibling
        ? targetUl.insertBefore(shadow, targetItemEl)
        : targetUl.appendChild(shadow);
    } else if (targetBoxEl) {
      targetBoxEl.appendChild(shadow);
    } else {
      itemEl.parentNode.insertBefore(shadow, itemEl);
    }
  };

  const onMouseUp = (upEvent) => {
    shadow.remove();
    itemEl.style.zIndex = '';
    itemEl.classList.remove('absolute');
    itemEl.removeEventListener('mousemove', onMouseMove);
    itemEl.removeEventListener('mouseup', onMouseUp);

    if (
      Math.abs(downEvent.clientX - upEvent.clientX) < 20 &&
      Math.abs(downEvent.clientY - upEvent.clientY) < 20
    )
      return;

    const [targetBoxEl, targetItemEl] = getTargetElements(upEvent, itemEl);
    if (targetItemEl) {
      const targetUl = getStickerByDom(targetBoxEl).dom.ul;
      targetItemEl.nextSibling
        ? targetUl.insertBefore(itemEl, targetItemEl)
        : targetUl.appendChild(itemEl);
    } else if (targetBoxEl) {
      const sticker = getStickerByDom(targetBoxEl);
      sticker.addItem(item);
    }
  };

  itemEl.addEventListener('mousemove', onMouseMove);
  itemEl.addEventListener('mouseup', onMouseUp);
};
