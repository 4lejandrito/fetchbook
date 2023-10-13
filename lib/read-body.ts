export default async function readBody(source: Request | Response) {
  if (source.headers.get("content-type")?.includes("application/json")) {
    return source.json();
  } else {
    return source.text();
  }
}
