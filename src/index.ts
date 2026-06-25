import "dotenv/config";
import { resolveInput } from "resolveInput";
import { runWorkflow } from "runWorkflow";

async function main() {
  const useRequestFile = process.argv.includes("--request");
  const { rawInput, label } = await resolveInput(useRequestFile);

  console.log(`[start] running ${label}`);
  const result = await runWorkflow(rawInput);

  console.log("\n=== RESULT ===\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
