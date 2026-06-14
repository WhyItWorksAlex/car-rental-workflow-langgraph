Workflow car-retal service

Launch this service by command "npm run dev" and it take one random case from file incomingRequests.json

To make it easier to understand the project structure, a shape was created. It is located in the project folder and is called "workflow-car-rental-shape.pdf".

Below, you can find all explanations about rules, decisions, routes and so on.

Base statements:

1. Human reply was have done with interrupt of workflow. For avoiding long waiting and real input, I decided to provided mock human reply after 3 seconds. But anyway there a stop by instuments "human-in-the-loop".
2. Some function like "bookingRefExists", "verifyPaymentCard" just imitate work of real function. Now they return always true. In real project of course we need to make real check up.
3. Folder "Business" has files for business rules.
4. Folder "Data" has mock data and folder with requests history.
5. All nodes combined in one file indexNodes.ts to make imports easier.
6. All routes lead to sendClientNode, it means that all request will be replied.
7. When some information reach a node buildHumanTicketNode and then humanReviewNode, a human knows information about previous route. It means he can estimate whether it was an emergency route or a main route according to our router (status from humanReviewSource.ts).
8. When we do an interrupt in human node and we will continue from this node after get reply, we can see doubling information from this node in console. It is normal behaviour when we stop and launch.

Short description of processes

1. Started from incoming JSON according to schema incomingRequest.ts
2. Added request ID on node addRequestIdNode
3. Validare request in validateRequestNode according to our schema by Zod instuments. Then we have to routes:
   3.1. Validate error - go to rejectRequestNode, set up a final status as "rejected", send to client message that there is a problems with data, please update request.
   3.2. Main route go to point 4
4. analyzeRequestNode is deterministic analyse of missing fields and push to state all mistakes which was founded.
5. classifyRequestNode is LLM model which estimate our request according to a few point. Whether exist additional requirement in comments which provided by client, urgency and existing problems with base fields (according to prevoius validate and analyse). Ruturn a structured output.
6. policyRouterNode, this is one the main nodes in our project. Here we have a set of rules, which helps to choose a right route for our request. We have 4 main routes and one emergency (for some cases). Also this node helps us to get bussines issuies in request (wrong booking dates, wrong city, unavailibale dates and so on)
7. autoReplyNode if we have enough data, no additional requirments, no urgent, no issies - go here. It is LLM which prepare a positive text for future client reply .
8. needInfoNode, if we have an obvious problems and no additional requirments and no urgent - go here. It is also LLM which prepare a text with request to provide necessary information for future handling current client request.
9. humanAiSummaryNode if we have a complex request, for example with modifying current booking, or additional requirements, or something complicated. it is LLM model, which help to make a summary of requests and specify keyPoint.
10. Human determinictic route leads directly from policyRouterNode to buildHumanTicketNode, this node helps to prepare an object with necessary information from request for human/operator. We choose this way when request is urgent, but quite simple and obvious. Also after humanAiSummaryNode (llm model) we go to this note. The difference is field aiOperatorBrief in state. When we go directly - null, when through LLM - some information from LLM. We also can reach this node from needInfoNode or autoReplyNode when LLM is broken and return error.
11. humanReviewNode, this a node for human. I have made an interrupt of our workflow. And when we het an information from human, we will continue our workflow.
12. summarizeHumanReplyNode this LLm created a text for final reply for client according to human decision. As I wrote above, now we kave a mock human reply.
13. sendClientNode send reply to client. We reach this nodes from any routes, because any request should be replied. Depends on the status, ways and so on, this node send a right text to customer to provided email.
14. saveHistoryNode. It helps us to save and history of request in the future for debuging, estimating and other actions. We can save at one file, ot different, or even in database, it up to customer of this service.
