import fs from "node:fs/promises";
import path from "node:path";
import type WorkflowState from "graph/state";
import { buildSafeRequest } from "tools/buildSafeRequest";
import { validateRequest } from "tools/validateRequest";
import { IncomingRequest } from "schemas/incomingRequest";

type State = typeof WorkflowState.State;

const HISTORY_DIR = path.join(process.cwd(), "src/data/requestsHistory");

function buildHistoryFileName(date = new Date()) {
  const iso = date.toISOString(); // 2026-06-04T12:30:45.123Z
  return iso.replace(/:/g, "-").replace(/\./g, "-") + ".json"; // → 2026-06-04T12-30-45-123Z.json
}

function buildSafeHistorySnapshot(state: State) {
  const safeRequest = state.request
    ? (() => {
        const { request, paymentCardProvided } = buildSafeRequest(state.request);
        return { ...request, paymentCardProvided };
      })()
    : null;

  const validate = validateRequest(state.rawInput);

  const { paymentCard, ...restRawInput } = validate.success ? validate.data : (state.rawInput as IncomingRequest);
  const safeRawInput = restRawInput;

  return {
    ...state,
    rawInput: safeRawInput,
    request: safeRequest,
  };
}

export async function saveRequestHistory(state: State) {
  if (state.finalRequestStatus === "pending") {
    console.log("[save_history] skip: status is pending");
    return null;
  }

  await fs.mkdir(HISTORY_DIR, { recursive: true });

  const fileName = buildHistoryFileName();
  const filePath = path.join(HISTORY_DIR, fileName);

  await fs.writeFile(filePath, JSON.stringify(buildSafeHistorySnapshot(state), null, 2), "utf-8");

  console.log("[save_history] saved:", filePath);
  return filePath;
}
