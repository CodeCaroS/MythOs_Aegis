export function findRootCause(steps) {
  return [...steps]
    .sort((a, b) => new Date(a.startedAt ?? 0) - new Date(b.startedAt ?? 0))
    .find(step => step.status === "error") ?? null;
}

export function traceSummary(trace, steps) {
  const rootCause = findRootCause(steps);
  return { ...trace, steps, rootCause, evaluationCandidate: Boolean(rootCause) || trace.evaluationStatus === "flagged" };
}
