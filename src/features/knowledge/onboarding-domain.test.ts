import { describe, expect, it } from "vitest";
import { answerOnboardingQuestion, createOnboardingState, onboardingProgress } from "./onboarding-domain";

describe("onboarding domain", () => {
  it("keeps the checkpoint and completes a short context brief", () => {
    let state = createOnboardingState("workspace-a");
    state = answerOnboardingQuestion(state, "business", "comunicação");
    state = answerOnboardingQuestion(state, "audience", "pequenas empresas");
    state = answerOnboardingQuestion(state, "success", "clareza e prazo");
    expect(state.status).toBe("COMPLETE");
    expect(state.summary).toContain("pequenas empresas");
    expect(onboardingProgress(state)).toEqual({ answered: 3, total: 3, percentage: 100 });
  });

  it("does not advance when a required answer is empty", () => {
    const state = createOnboardingState("workspace-a");
    const next = answerOnboardingQuestion(state, "business", " ");
    expect(next.status).toBe("WAITING_USER");
    expect(next.questionIndex).toBe(0);
  });
});
