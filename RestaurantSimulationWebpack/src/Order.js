import { getNewIdGenerator } from './utils/IdGenerator.js';

const orderList = document.querySelector('#order-wrapper #order-list');
const cookingList = document.querySelector('#chef-wrapper #cooking-list');
const servingList = document.querySelector('#server-wrapper #serving-list');

const getNextId = getNewIdGenerator();

const orders = [];

class Order {
  li = null;
  cookingLi = null;
  servingLi = null;

  constructor(name, status) {
    this.number = getNextId();
    this.name = name;
    this.status = status;
    this.render();
  }

  render = () => {
    this.li = document.createElement('li');
    this.li.setAttribute('id', 'order' + this.number);
    this.li.innerText = `주문${this.number}\t${this.name}\t${this.status}`;
    orderList.appendChild(this.li);
  };

  async update() {
    this.li.innerText = `주문${this.number}\t${this.name}\t${this.status}`;
  }

  async remove() {
    this.li.remove();
    this.li = null;
  }

  async renderCooking() {
    this.cookingLi = document.createElement('li');
    this.cookingLi.setAttribute('id', 'cooking' + this.number);
    this.cookingLi.innerText = `주문${this.number}\t${this.name}\t${this.status}`;
    cookingList.appendChild(this.cookingLi);
  }

  async removeCooking() {
    this.cookingLi.remove();
    this.cookingLi = null;
  }

  async renderServing() {
    this.servingLi = document.createElement('li');
    this.servingLi.setAttribute('id', 'serving' + this.number);
    this.servingLi.innerText = `주문${this.number}\t${this.name}\t${this.status}`;
    servingList.appendChild(this.servingLi);
  }

  async removeServing() {
    this.servingLi.remove();
    this.servingLi = null;
  }
}

export const createOrder = (name) => {
  const order = new Order(name, '대기');
  orders.push(order);
};

export const getFirstOrder = () => orders.shift();
