const cookTime = {
  순댓국: 1000,
  해장국: 2000,
};

class Chef {
  constructor(name, isCook, order) {
    this.name = name;
    this.isCook = isCook;
    this.order = order;
    this.li = document.querySelector(`#chef-wrapper #chef-list #${name}`);
  }

  async render() {
    const li = this.li;
    if (!li) return;

    li.innerText = `${this.name}\t${this.isCook ? '요리중' : '대기'}\t${
      this.order ? '주문' + this.order.number : ''
    }`;
  }

  async cookDishes(order) {
    order.status = '요리중';
    await order.update();
    await order.renderCooking();

    this.order = order;
    await this.render();

    const time = cookTime[order.name];

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        await order.removeCooking();
        this.isCook = false;
        this.order = null;
        await this.render();

        resolve(order);
      }, time ?? 1000);
    });
  }
}

const chefs = [];

export const createDefaultChefs = () => {
  chefs.push(new Chef('대장금', false, null), new Chef('백주부', false, null));
};

export const getWatingChef = () => {
  return new Promise((resolve, reject) => {
    function run() {
      const watingChef = chefs.find((chef) => chef.isCook === false);
      if (watingChef) {
        watingChef.isCook = true;
        resolve(watingChef);
      } else {
        setTimeout(run, 200);
      }
    }
    run();
  });
};

export const renderAllChefs = () => chefs.forEach((chef) => chef.render());
