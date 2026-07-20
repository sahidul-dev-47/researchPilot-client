/**
 * Utility to dynamically generate a clean, premium AI summary from full research description.
 * This simulates a professional Gemini AI response format on the client.
 */
export function generateAISummary(fullDescription: string, title: string) {
  // Split description by sentence boundary
  const sentences = fullDescription
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  // Group sentences to simulate key AI extraction categories
  const keyObjectives = sentences.slice(0, Math.min(2, sentences.length));
  const methodology = sentences.slice(
    Math.min(2, sentences.length),
    Math.min(5, sentences.length)
  );
  const potentialImpact = sentences.slice(
    Math.min(5, sentences.length),
    Math.min(8, sentences.length)
  );

  return {
    executiveSummary:
      sentences[0] ||
      `This project investigates key concepts and applications surrounding ${title}.`,
    keyObjectives: keyObjectives.length > 0 ? keyObjectives : [
      "Define and structure core theoretical frameworks.",
      "Conduct rigorous diagnostic reviews of research models.",
    ],
    methodology: methodology.length > 0 ? methodology : [
      "Review historical literatures and database structures.",
      "Analyze empirical outcomes against benchmark methodologies.",
    ],
    potentialImpact: potentialImpact.length > 0 ? potentialImpact : [
      "Accelerate domain understanding and policy formulations.",
      "Establish foundations for subsequent quantitative analysis.",
    ],
  };
}
