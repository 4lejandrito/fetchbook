import { FetchStory } from "fetchbook";

export default {
  name: "A Link to the Past",
  url: "https://zelda.fanapis.com/api/games/5f6ce9d805615a85623ec2b8",
  init: {
    method: "GET",
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      data: {
        name: "The Legend of Zelda: A Link to the Past",
        released_date: " April 13, 1992",
      },
    },
  },
} satisfies FetchStory;
