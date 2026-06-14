import { sendFinalAnswer } from "../../tools/sendFinalAnswer";
import { resolveClientMessage } from "../../tools/resolveClientMessage";
import type WorkflowState from "../state";
import { FALLBACK_CLIENT_MESSAGE, VALIDATION_FAILED_MESSAGE } from "const";
import z from "zod";

type State = typeof WorkflowState.State;

export async function sendClientNode(state: State) {
  let answerText: string;
  let email: string;

  if (state.finalRequestStatus === "rejected") {
    answerText = state.validationError ? VALIDATION_FAILED_MESSAGE : FALLBACK_CLIENT_MESSAGE;
    const parsed = z.object({ customerEmail: z.email() }).safeParse(state.rawInput);
    email = parsed.success ? parsed.data.customerEmail : "unknown@customer";
  } else {
    answerText = resolveClientMessage(state);
    email = state.request?.customerEmail ?? "unknown@customer";
  }

  console.log("[send_client] sending to:", email, "with answerText:", answerText);

  try {
    sendFinalAnswer({ email, answerText });
    if (state.finalRequestStatus !== "rejected") {
      return { finalRequestStatus: "fulfilled" as const };
    }
  } catch (error) {
    console.error("[send_client] send failed:", error);
    return { finalRequestStatus: "rejected" as const };
  }
}
