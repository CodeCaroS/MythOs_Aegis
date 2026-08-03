function clampScore(score) {
  const value = Number(score);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function cell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

export async function runRegression({ cases, baseline, candidate, judge, allowedDrop = 0.05 }) {
  const results = [];
  for (const item of cases) {
    const [baselineAnswer, candidateAnswer] = await Promise.all([baseline(item), candidate(item)]);
    const [baselineJudgment, candidateJudgment] = await Promise.all([
      judge({ item, answer: baselineAnswer, version: "baseline" }),
      judge({ item, answer: candidateAnswer, version: "candidate" })
    ]);
    const baselineScore = clampScore(baselineJudgment.score);
    const candidateScore = clampScore(candidateJudgment.score);
    const drop = baselineScore - candidateScore;
    const regression = drop > allowedDrop || candidateScore < Number(item.minimumScore ?? 0);
    results.push({ id: item.id, baselineAnswer, candidateAnswer, baselineScore, candidateScore, drop, regression, reason: candidateJudgment.reason ?? "" });
  }
  const passed = results.every(result => !result.regression);
  const rows = results.map(result => `| ${cell(result.id)} | ${result.baselineScore.toFixed(2)} | ${result.candidateScore.toFixed(2)} | ${result.drop.toFixed(2)} | ${result.regression ? "FAIL" : "PASS"} | ${cell(result.reason)} |`).join("\n");
  const markdown = `# Model regression report\n\n**Result:** ${passed ? "PASS" : "FAIL"}\n\n| Case | Baseline | Candidate | Drop | Status | Judge reason |\n| --- | ---: | ---: | ---: | --- | --- |\n${rows}\n`;
  return { passed, cases: results, markdown };
}
