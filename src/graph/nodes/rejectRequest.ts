export async function rejectRequestNode() {
  console.log("[reject_request] finalRequestStatus: rejected");
  return { finalRequestStatus: "rejected" as const };
}
