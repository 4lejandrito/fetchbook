import colorizer from "json-colorizer";

export default async function serialize(
  object: any,
): Promise<string | undefined> {
  return object instanceof Blob
    ? object.type.includes("application/json")
      ? await object.json()
      : undefined
    : typeof object === "object"
    ? colorizer(JSON.stringify(object), { pretty: true })
    : undefined;
}
