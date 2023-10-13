import jsonServer from "json-server";
import { Server } from "http";

let server: Server | undefined;

export default {
  start: async () =>
    new Promise<void>((resolve) => {
      const app = jsonServer.create();
      app.use(jsonServer.defaults());
      app.use(
        jsonServer.router({
          posts: [
            {
              id: 1,
              it: "works!",
            },
          ],
        }),
      );
      server = app.listen(3000, resolve);
    }),
  stop: () => server?.close(),
};
