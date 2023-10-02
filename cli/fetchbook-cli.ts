import colorizer from "json-colorizer";
import { RequestStory } from "..";

export const requestStory = (story: RequestStory) => story;

const baseUrl = process.env.BASE_URL;
const echoServer = baseUrl
  ? undefined
  : Bun.serve({
      fetch(req) {
        return new Response(req.body);
      },
    });

const response = await (async function run(story: RequestStory) {
  for (const beforeStory of story.before ?? []) {
    await run(beforeStory);
  }
  const response = await fetch(
    `${baseUrl ?? `http://localhost:${echoServer?.port}`}/${story.url}`,
    {
      ...story.request,
      headers: {
        ...story.request.headers,
        Authorization: "Basic " + btoa("test@liferay.com:test"),
      },
    }
  );
  if (Bun.argv.includes("-v")) {
    console.log("✓", story.name, response.status);
  }
  for (const afterStory of story.after ?? []) {
    await run(afterStory);
  }
  return response;
})(await import(Bun.argv[2]).then((mod) => mod.default as RequestStory));
console.log(colorizer(JSON.stringify(await response.json()), { pretty: true }));
echoServer?.stop();
