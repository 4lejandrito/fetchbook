import { FetchStory } from "fetchbook";

export default async function visit(
  stories: FetchStory[],
  visitor: (story: FetchStory) => Promise<void>,
) {
  for (const story of stories) {
    await visit(story.before ?? [], visitor);
    await visitor(story);
    await visit(story.after ?? [], visitor);
  }
}
