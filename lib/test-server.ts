import jsonServer from "json-server";
import http from "http";

type TestServer = {
  start: () => Promise<void>;
  reset: () => Promise<void>;
  stop: () => Promise<void>;
};

let testServer: TestServer | undefined = undefined;

if (process.env.FETCHBOOK_TEST) {
  const app = jsonServer.create();
  app.disable("etag");
  app.use(jsonServer.defaults({ logger: false }));
  const router = jsonServer.router<{ posts: { id: number; it?: string }[] }>({
    posts: [],
  });
  app.use(router);
  const server = http.createServer(app);

  testServer = {
    start: () =>
      new Promise<void>((resolve) => {
        process.env.FETCHBOOK_TEST ? server.listen(3000, resolve) : resolve();
      }),
    reset: async () => {
      router.db.setState({
        posts: [
          {
            id: 1,
            it: "works!",
          },
        ],
      });
    },
    stop: () =>
      new Promise<void>((resolve) => {
        process.env.FETCHBOOK_TEST ? server.close(() => resolve()) : resolve();
      }),
  };
}

export default testServer;
