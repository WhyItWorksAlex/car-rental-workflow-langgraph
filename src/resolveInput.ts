import path from "node:path";
import incomingRequests from "data/incomingRequests.json";
import { loadRequestFile } from "loadRequestFile";

const REQUEST_FILE = path.join(process.cwd(), "request.json");

export async function resolveInput(useRequestFile: boolean) {
  if (useRequestFile) {
    return {
      rawInput: await loadRequestFile(REQUEST_FILE),
      label: `request from ${REQUEST_FILE}`,
    };
  }

  return {
    rawInput: incomingRequests[Math.floor(Math.random() * incomingRequests.length)],
    label: "random request from incomingRequests.json",
  };
}
