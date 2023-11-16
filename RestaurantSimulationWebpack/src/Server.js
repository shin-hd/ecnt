class Server {
  constructor(name, serveTime, isServing, dishes) {
    this.name = name;
    this.serveTime = serveTime;
    this.isServing = isServing;
    this.dishes = dishes;
    this.li = document.querySelector(`#server-wrapper #server-list #${name}`);
  }

  async serveDishes(dishes) {
    dishes.status = '서빙중';
    await dishes.update();
    await dishes.renderServing();

    this.dishes = dishes;
    await this.render();

    const time = this.serveTime;

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        await dishes.remove();
        await dishes.removeServing();

        this.isServing = false;
        this.dishes = null;
        await this.render();

        dishes.status = '완료';
        resolve(dishes);
      }, time);
    });
  }

  async render() {
    const li = this.li;
    if (!li) return;

    li.innerText = `${this.name}\t${this.isServing ? '서빙중' : '대기'}\t${
      this.dishes ? '주문' + this.dishes.number : ''
    }`;
  }
}

const servers = [];

export const createDefaultServers = () => {
  servers.push(
    new Server('홍길동', 1000, false, null),
    new Server('핑핑이', 2000, false, null),
  );
};

export const getWatingServer = () => {
  return new Promise((resolve, reject) => {
    function run() {
      const watingServer = servers.find((server) => server.isServing === false);
      if (watingServer) {
        watingServer.isServing = true;

        resolve(watingServer);
      } else {
        setTimeout(run, 200);
      }
    }
    run();
  });
};

export const renderAllServers = () =>
  servers.forEach((server) => server.render());
