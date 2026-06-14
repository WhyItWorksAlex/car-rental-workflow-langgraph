import { evaluateBusinessRules } from "business/evaluateBusinessRules";
import { routePolicy } from "../../router/routerPolicy";
import type WorkflowState from "../state";

type State = typeof WorkflowState.State;

export async function policyRouterNode(state: State) {
  console.log("[policy] requestId:", state.requestId);

  if (!state.request) {
    return { business: null, route: null };
  }

  const business = evaluateBusinessRules(state.request);
  const route = routePolicy({
    request: state.request,
    analysis: state.analysis,
    business,
    classification: state.classification,
  });

  console.log("[policy] businessIssues:", business.businessIssues);
  console.log("[policy] route:", route);

  return { business, route };
}
