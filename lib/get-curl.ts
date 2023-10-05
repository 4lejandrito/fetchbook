import fetchToCurl from "fetch-to-curl";
import serialize from "./serialize";

export default async function getCurl(request: Request) {
  return fetchToCurl({
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: await serialize(await request.blob()),
  });
}
