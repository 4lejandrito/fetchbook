import jsonServer from "json-server";
import { Server } from "http";

let server: Server | undefined;

export default {
  start: async () =>
    new Promise<void>((resolve) => {
      const app = jsonServer.create();
      const router = jsonServer.router({
        posts: [
          {
            id: 1,
            it: "works!",
          },
        ],
      });
      const middlewares = jsonServer.defaults();
      app.use(middlewares);
      app.use(router);
      server = app.listen(3000, resolve);
    }),
  stop: () => server?.close(),
};
