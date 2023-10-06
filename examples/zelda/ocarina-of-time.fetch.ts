import { FetchStory } from "../..";

const story: FetchStory = {
  name: "Best game ever",
  url: "https://zelda.fanapis.com/api/games/5f6ce9d805615a85623ec2ba",
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
        name: "The Legend of Zelda: Ocarina of Time",
        released_date: " November 23, 1998",
      },
    },
  },
};

export default story;
