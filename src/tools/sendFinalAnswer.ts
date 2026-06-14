export type SendFinalAnswerParams = {
  email: string;
  answerText: string;
};

export function sendFinalAnswer(param: SendFinalAnswerParams) {
  // some sending complicated algorithm
  console.log(param);
}
