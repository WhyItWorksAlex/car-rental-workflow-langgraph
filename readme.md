# Workflow with AI for car-retal service

LangGraph workflow for a car-rental support desk: it takes a client request as JSON, validates and analyzes it, classifies it with an LLM, and routes it to auto-reply, clarification, or human review — so operators are involved only when the case is complex, uncertain, or violates business rules.

## Overview

This project helps to evaluate any request from client to car-rental service. It can evaluate additional requirements, type of request, urgency and so on. Depends on some parametrs it can choose different routes to optimize human routine and avoid unnecessary load to operator. Now it works for cities Haifa and Tel-Aviv.

During this workflow we have an LLM decision, LLM summarize, a lot of deterministic functions related to validation or bussines rules, emergency routes, human in the loop. It do a pause and wait human reply.

Any request will be replied despite the fact that error might appear at any step of our workflow. Any routes will come to node which response for dending message to client.

Final state (information about whole process) will store in separate file for each request in folder requestHistory.

To make it easier to understand the service structure, a shape was created. It is located in the project folder and is called "workflow-car-rental-shape.pdf".

---

## Tech stack

|             |            |
| ----------- | ---------- |
| Language    | Typescript |
| Workflow by | LangGraph  |
| LLM         | OpenAI     |
| Validation  | Zod        |
| Test        | Vitest     |

---

## Quick start

### 1. OpenAI API key (do this once)

The repo contains **`.env.example`** — a template with a fake key (safe to share).

Your real key goes in **`.env`** — that file is created **by you**.

After `git clone` you do **not** have `.env` yet, so you copy the template:

```bash
cp .env.example .env
```

Then open `.env` and paste your real `OPENAI_API_KEY`.

### 2. Run the workflow

The workflow has **two input modes** — use one of them:

| Mode        | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| **random**  | Picks a random test case from `src/data/incomingRequests.json` |
| **request** | Runs your own case from `request.json` in the project root     |

#### If you choose **request**

Before the first run (and before each new case):

1. Open `request.json` in the project root.
2. Replace the example values with your data (see [Example for incoming request](#example-for-incoming-request) below).
3. The `_fields` block is only a field guide — it is **not** sent to the workflow.
4. You do **not** need to rebuild the Docker image after editing — save the file and run again.

#### Commands

Pick **one** column — Docker or Node.js (you do not need both). Run `npm install` once and only if you use Node.js.

| Mode        | Docker                                    | Node.js               |
| ----------- | ----------------------------------------- | --------------------- |
| **random**  | `docker compose run --build --rm random`  | `npm run dev`         |
| **request** | `docker compose run --build --rm request` | `npm run dev:request` |

**Docker:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) only — Node.js not required.

**Node.js:** version 20+.

Logs print to the terminal. History saves to `src/data/requestsHistory/`. The process exits when done (CLI, not a website). `npm run build` is not required for Docker.

---

## Tests

Launch tests by command `npm run test`

---

## Example for incoming request

Below if example for incoming request with definition for each field:

```json
{
  "customerEmail": "anna.klein@example.com", // email
  "requestType": "new_booking", // type of request, might be "new_booking", "modify_booking" or "cancel"
  "bookingRef": null, // current booking number, if we have. Type of number is two catipal letters, than hyphen and 5 numerals, example AB-12345
  "pickupCity": "Tel Aviv", // name of city
  "pickupDateAndTime": "2026-07-10T09:00:00Z", //pick up date and time
  "returnDateAndTime": "2026-07-12T18:00:00Z", // return date and time
  "carCategory": "economy", // car category, might be "economy", "compact", "suv", "van" or "premium"
  "paymentCard": {
    // information about payment card
    "cardNumber": "4111111111111111",
    "expiryDate": "06/28",
    "cvv": "123",
    "cardholderName": "Anna Klein"
  },
  "additionalNotes": "" // any additions, "need children car seat", "pick up location is airport" and so on. Any additional requirement or wahtever you want.
}
```

The output from this forkflow is just a message. The message combined with emails and send to client.

---

## Limitations

1. We can provide only city Haifa or Tel Aviv to get a correct responce, otherwise we get reply that we nned to choose a right city.
2. Payment card is necessary for "new_booking" type
3. Date and time needs to provide exactly in format as in example.

---

## Workflow pipeline

**G1.** Zod validation (`validateRequestNode`, deterministic) — pass → `analyze`, fail → `reject_request` → `send_client`

**G2.** Field analysis (`analyzeRequestNode`, deterministic) — always → `classify`; records `fieldIssues` (missing / invalid / unexpected fields) for later gates

**G3.** LLM classification (`classifyRequestNode`, LLM structured output) — pass → `policy` with `classification`, fail (`null` / API error) → `policy` → `human_ai_summary`

**G4.** Classification safety (`routePolicy` early checks, deterministic on LLM output) — fail if `confidence === low` OR `bookingTypeIntension === unclear` OR `declaredIntentMatches === false` OR `requestType !== bookingTypeIntension` → `human_ai_summary`; pass → G5

**G5.** Business rules (`evaluateBusinessRules` in `policyRouterNode`, deterministic) — issues (city, dates, slots, booking ref) → influence route; no separate fail node, evaluated inside G6

**G6.** Route selection (`routePolicy`, deterministic) — pass branches:

- `need_info` → `needInfoNode`
- `human_deterministic` → `buildHumanTicketNode`
- `human_ai_summary` → `humanAiSummaryNode` → `buildHumanTicketNode`
- `auto_reply` → `autoReplyNode`

fail (no branch matches) → `human_ai_summary`

**G7.** Auto-reply LLM (`autoReplyNode`, LLM) — pass → `send_client`, fail (`autoReply === null`) → `human_deterministic`

**G8.** Clarification LLM (`needInfoNode`, LLM) — pass → `send_client`, fail (`clarificationReply === null`) → `human_deterministic`

**G9.** Operator brief LLM (`humanAiSummaryNode`, LLM) — pass → `buildHumanTicketNode` with `aiOperatorBrief`, fail → `buildHumanTicketNode` without brief (`ai_operator_brief_failed`)

**G10.** Human review (`humanReviewNode`, human-in-the-loop) — interrupt until operator reply; pass (resume) → `summarize_human_reply`

**G11.** Human reply summary (`summarizeHumanReplyNode`, LLM) — pass → `send_client`

**G12.** Client delivery (`sendClientNode`, deterministic) — always replies (including rejected requests) → `save_history` → end

---

## CI quality gates

[![CI](https://github.com/WhyItWorksAlex/car-rental-workflow-langgraph/actions/workflows/ci.yml/badge.svg)](https://github.com/WhyItWorksAlex/car-rental-workflow-langgraph/actions/workflows/ci.yml)

On every push and pull request, GitHub Actions runs:

- `npm run test` — routing & validation eval set
- `npm run build` — TypeScript compile

---

## Future improvements

1. Opportunity to modify booking without human.
2. Work with main (popular) additional requirements without human.
