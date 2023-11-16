import { createDefaultChefs, getWatingChef, renderAllChefs } from './Chef.js';
import {
  createDefaultServers,
  getWatingServer,
  renderAllServers,
} from './Server.js';
import { createOrder, getFirstOrder } from './Order.js';

const finishedDishes = [];
const orderButtons = document.querySelector('.btns-order');

const onOrderButtonClick = async (e) => {
  const value = e.target.value;
  if (!value) return;
  createOrder(value);
};
orderButtons.addEventListener('click', onOrderButtonClick);

const init = () => {
  createDefaultChefs();
  createDefaultServers();
  renderAllChefs();
  renderAllServers();
};
init();

const handleOrder = async () => {
  const order = getFirstOrder();
  if (!order) return;

  const chef = await getWatingChef();

  const dishes = await chef.cookDishes(order);
  const server = await getWatingServer();

  const finished = await server.serveDishes(dishes);
  finishedDishes.push(finished);
};
setInterval(handleOrder, 1000);
