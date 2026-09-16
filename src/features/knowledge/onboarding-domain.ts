import type { OnboardingState } from "@/types/knowledge";
import { onboardingQuestions } from "./knowledge-domain";

export function createOnboardingState(workspaceId: string, existing?: Partial<OnboardingState>): OnboardingState {
  return {
    id: existing?.id ?? `onboarding-${workspaceId}`,
    workspaceId,
    status: existing?.status ?? "NOT_STARTED",
    questionIndex: existing?.questionIndex ?? 0,
    answers: existing?.answers ?? {},
    summary: existing?.summary,
    nextStep: existing?.nextStep ?? "Responder a primeira pergunta para começar",
  };
}

export function answerOnboardingQuestion(state: OnboardingState, questionId: string, answer: string): OnboardingState {
  const question = onboardingQuestions.find((item) => item.id === questionId);
  if (!question) return state;
  const value = answer.trim();
  if (question.required && !value) return { ...state, status: "WAITING_USER", nextStep: "Responder esta pergunta para continuar" };
  const answers = { ...state.answers, [questionId]: value };
  const nextQuestionIndex = Math.min(onboardingQuestions.length, Math.max(state.questionIndex, onboardingQuestions.findIndex((item) => item.id === questionId) + 1));
  const complete = onboardingQuestions.every((item) => !item.required || Boolean(answers[item.id]?.trim()));
  return {
    ...state,
    status: complete ? "COMPLETE" : "IN_PROGRESS",
    questionIndex: nextQuestionIndex,
    answers,
    summary: complete ? buildOnboardingSummary(answers) : state.summary,
    nextStep: complete ? "Revisar o resumo e confirmar o contexto" : `Responder: ${onboardingQuestions[nextQuestionIndex]?.prompt ?? "próxima pergunta"}`,
  };
}

export function buildOnboardingSummary(answers: Record<string, string>) {
  const business = answers.business || "atividade ainda não informada";
  const audience = answers.audience || "público ainda não informado";
  const success = answers.success || "critério de sucesso ainda não informado";
  return `O workspace trabalha com ${business}. O foco é atender ${audience}. Um bom resultado precisa respeitar: ${success}.`;
}

export function onboardingProgress(state: OnboardingState) {
  const answered = onboardingQuestions.filter((question) => Boolean(state.answers[question.id]?.trim())).length;
  return { answered, total: onboardingQuestions.length, percentage: Math.round((answered / onboardingQuestions.length) * 100) };
}
