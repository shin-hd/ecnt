const orderButtons = document.querySelector('.btns-order');
const orderList = document.querySelector('#order-wrapper #order-list');
const cookingList = document.querySelector('#chef-wrapper #cooking-list');
const servingList = document.querySelector('#server-wrapper #serving-list');

const chef1 = document.querySelector('#chef-wrapper #chef-list #대장금');
const chef2 = document.querySelector('#chef-wrapper #chef-list #백주부');

const server1 = document.querySelector('#server-wrapper #server-list #홍길동');
const server2 = document.querySelector('#server-wrapper #server-list #핑핑이');

class Chef {
  constructor(name, isCook, order) {
    this.name = name;
    this.isCook = isCook;
    this.order = order;
  }

  chefToLi = {
    대장금: chef1,
    백주부: chef2,
  };

  getLi() {
    return this.chefToLi[this.name];
  }
}

class Server {
  constructor(name, serveTime, isServing, dishes) {
    this.name = name;
    this.serveTime = serveTime;
    this.isServing = isServing;
    this.dishes = dishes;
  }

  serverToLi = {
    홍길동: server1,
    핑핑이: server2,
  };

  getLi() {
    return this.serverToLi[this.name];
  }
}

const getNewNumber = (() => {
  let number = 1;
  return () => number++;
})();
class Order {
  num = 1;
  constructor(name, status) {
    this.number = getNewNumber();
    this.name = name;
    this.status = status;
  }
}

let orders = [];

const chefs = [
  new Chef('대장금', false, null),
  new Chef('백주부', false, null),
];

let cooking = [];
const cookTime = {
  순댓국: 1000,
  해장국: 2000,
};

let serving = [];
const servers = [
  new Server('홍길동', 1000, false, null),
  new Server('핑핑이', 2000, false, null),
];

const done = [];

const removeOrder = async (order) => {
  const li = orderList.querySelector(`#order${order.number}`);
  li.remove();
};
const updateOrder = async (order) => {
  const li = orderList.querySelector(`#order${order.number}`);
  li.innerText = `주문${order.number}\t${order.name}\t${order.status}`;
};
const renderOrder = async (order) => {
  const li = document.createElement('li');
  li.setAttribute('id', 'order' + order.number);
  li.innerText = `주문${order.number}\t${order.name}\t${order.status}`;
  orderList.appendChild(li);
};

const removeCooking = async (order) => {
  const li = cookingList.querySelector(`#cooking${order.number}`);
  li.remove();
};
const renderCooking = async (order) => {
  const li = document.createElement('li');
  li.setAttribute('id', 'cooking' + order.number);
  li.innerText = `주문${order.number}\t${order.name}\t${order.status}`;
  cookingList.appendChild(li);
};

const removeServing = async (dishes) => {
  const li = servingList.querySelector(`#serving${dishes.number}`);
  li.remove();
};
const renderServing = async (dishes) => {
  const li = document.createElement('li');
  li.setAttribute('id', 'serving' + dishes.number);
  li.innerText = `주문${dishes.number}\t${dishes.name}\t${dishes.status}`;
  servingList.appendChild(li);
};

const renderChef = async (chef) => {
  const li = chef.getLi();
  if (!li) return;

  li.innerText = `${chef.name}\t${chef.isCook ? '요리중' : '대기'}\t${
    chef.order ? '주문' + chef.order.number : ''
  }`;
};

const renderServer = async (server) => {
  const li = server.getLi();
  if (!li) return;

  li.innerText = `${server.name}\t${server.isServing ? '서빙중' : '대기'}\t${
    server.dishes ? '주문' + server.dishes.number : ''
  }`;
};

const init = () => {
  chefs.forEach((chef) => renderChef(chef));
  servers.forEach((server) => renderServer(server));
};
init();

const onOrderButtonClick = async (e) => {
  const value = e.target.value;
  if (!value) return;
  const order = new Order(value, '대기');
  orders = [...orders, order];
  await renderOrder(order);
};
orderButtons.addEventListener('click', onOrderButtonClick);

const getChef = () => {
  return new Promise((resolve, reject) => {
    function run() {
      const watingChef = chefs.filter((chef) => chef.isCook === false);
      if (watingChef.length > 0) {
        const chef = watingChef[0];
        chef.isCook = true;
        resolve(chef);
      } else {
        setTimeout(run, 200);
      }
    }
    run();
  });
};

const cookDishes = async (order, chef) => {
  order.status = '요리중';
  await updateOrder(order);
  await renderCooking(order);

  chef.order = order;
  await renderChef(chef);

  cooking.push(order);

  const time = cookTime[order.name];

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await removeCooking(order);
      chef.isCook = false;
      chef.order = null;
      await renderChef(chef);

      chefs.push(chef);
      const idx = cooking.indexOf(order);
      cooking = cooking.splice(idx);

      resolve(order);
    }, time);
  });
};

const getServer = () => {
  return new Promise((resolve, reject) => {
    function run() {
      const watingServer = servers.filter(
        (server) => server.isServing === false,
      );
      if (watingServer.length > 0) {
        const server = watingServer[0];
        server.isServing = true;

        resolve(server);
      } else {
        setTimeout(run, 200);
      }
    }
    run();
  });
};

const serveDishes = async (dishes, server) => {
  dishes.status = '서빙중';
  await updateOrder(dishes);
  await renderServing(dishes);

  serving.push(dishes);
  server.dishes = dishes;
  await renderServer(server);

  const time = server.serveTime;

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await removeOrder(dishes);
      await removeServing(dishes);

      server.isServing = false;
      server.dishes = null;
      await renderServer(server);

      servers.push(server);
      dishes.status = '완료';
      const idx = serving.indexOf(dishes);
      serving = serving.splice(idx);
      done.push(dishes);

      resolve();
    }, time);
  });
};

const handleOrder = async () => {
  const order = orders.shift();
  if (!order) return;

  const chef = await getChef();

  const dishes = await cookDishes(order, chef);
  const server = await getServer();

  await serveDishes(dishes, server);
};
setInterval(handleOrder, 1000);
