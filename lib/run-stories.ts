import { FetchStory } from "fetchbook";
import testServer from "./test-server";
import { Listr, ListrTask } from "listr2";
import groupStories from "./group-stories";
import { FileFetchStory } from "./find-stories";
import picocolors from "picocolors";
import expect from "expect";
import serialize from "./serialize";
import readBody from "./read-body";

function processStory(
  story: FetchStory,
  options: { dryRun?: boolean; verbose?: boolean },
  root?: boolean,
): ListrTask {
  return {
    title: options.verbose
      ? undefined
      : `${picocolors.bold(story.init.method)} ${story.name} ...`,
    task: async (_, task) => {
      const { before, after } = story;
      const tasks: ListrTask[] = [];
      if (root && testServer) tasks.push({ task: testServer.reset });
      if (before?.length) {
        tasks.push({
          title: options.verbose ? undefined : "Before",
          task: (_, task) =>
            task.newListr(before.map((story) => processStory(story, options))),
        });
      }
      tasks.push({
        task: async () => {
          let response: Response | undefined;
          let body: any;
          if (!options.dryRun) {
            response = await fetch(new Request(story.url, story.init));
            body = await readBody(response);
            if (story.expect) {
              try {
                expect({
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers.toJSON(),
                  body,
                }).toMatchObject(story.expect);
              } catch (err: any) {
                throw err.message;
              }
            }
          }
          if (options.verbose) {
            console.log(
              await serialize({
                request: {
                  url: story.url,
                  method: story.init.method,
                  headers: story.init.headers,
                  body:
                    story.init.method === "GET"
                      ? undefined
                      : await readBody(new Request(story.url, story.init)),
                },
                response: response
                  ? {
                      status: response.status,
                      headers:
                        response.headers.count > 0
                          ? response.headers
                          : undefined,
                      body,
                    }
                  : undefined,
              }),
            );
          } else {
            task.title = `${picocolors.bold(story.init.method)} ${
              story.name
            } ${picocolors.green(response?.status ?? "")}`;
          }
        },
      });
      if (after?.length) {
        tasks.push({
          title: options.verbose ? undefined : "After",
          task: (_, task) =>
            task.newListr(after.map((story) => processStory(story, options))),
        });
      }
      return task.newListr(tasks, {
        rendererOptions: { collapseSubtasks: true },
      });
    },
  };
}

export default async function runStories(
  stories: FileFetchStory[],
  options: {
    verbose?: boolean;
    dryRun?: boolean;
  },
) {
  await testServer?.start();
  await new Listr<void, "default" | "simple">(
    groupStories(stories).map(({ name, stories }) => ({
      title: options.verbose ? undefined : name,
      task: (_, task) =>
        task.newListr(
          stories.map((story) => processStory(story, options, true)),
        ),
    })),
    options.verbose
      ? { renderer: "simple" }
      : { rendererOptions: { collapseSubtasks: false } },
  )
    .run()
    .finally(testServer?.stop);
}
