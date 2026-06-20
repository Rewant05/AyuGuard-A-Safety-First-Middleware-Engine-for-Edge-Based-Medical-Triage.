import fs from 'fs';
import path from 'path';
import { safetyRoute } from '../lib/safetyRouter';

const datasetPath = path.join(__dirname, '../dataset/indian_medical_safety_prompts.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

let correctActionCount = 0;
let correctEscalationCount = 0;
let falseAllowCount = 0;
let falseBlockCount = 0;
const categoryStats: Record<string, { total: number; correct: number }> = {};

for (const item of dataset) {
  const result = safetyRoute(item.prompt);
  
  if (!categoryStats[item.category]) {
    categoryStats[item.category] = { total: 0, correct: 0 };
  }
  categoryStats[item.category].total += 1;

  const actionMatch = result.action === item.expected_action;
  if (actionMatch) {
    correctActionCount++;
    categoryStats[item.category].correct += 1;
  } else {
    // Check false allows/blocks
    if (result.action === 'allow' && item.expected_action !== 'allow') {
      falseAllowCount++;
    }
    if (result.action === 'block' && item.expected_action === 'allow') {
      falseBlockCount++;
    }
  }

  const expectedEscalation = item.expected_action === 'escalate';
  if (result.escalation_required === expectedEscalation) {
    correctEscalationCount++;
  }
}

const totalPrompts = dataset.length;
const actionAccuracy = (correctActionCount / totalPrompts) * 100;
const escalationAccuracy = (correctEscalationCount / totalPrompts) * 100;
const falseAllowRate = (falseAllowCount / totalPrompts) * 100;
const falseBlockRate = (falseBlockCount / totalPrompts) * 100;

console.log("=== MedSafety Router Evaluation (Simulated Baseline) ===");
console.log(`Total Prompts Evaluated: ${totalPrompts}`);
console.log(`Action Accuracy: ${actionAccuracy.toFixed(2)}%`);
console.log(`Escalation Accuracy: ${escalationAccuracy.toFixed(2)}%`);
console.log(`False Allow Rate: ${falseAllowRate.toFixed(2)}%`);
console.log(`False Block Rate: ${falseBlockRate.toFixed(2)}%`);
console.log(`Unsafe Response Reduction Estimate: ${(100 - falseAllowRate).toFixed(2)}%`);
console.log("\nCategory-wise Performance:");
for (const [cat, stats] of Object.entries(categoryStats)) {
  const acc = (stats.correct / stats.total) * 100;
  console.log(` - ${cat}: ${acc.toFixed(2)}%`);
}

fs.writeFileSync(
  path.join(__dirname, '../dataset/evaluation_results.json'),
  JSON.stringify({
    totalPrompts,
    actionAccuracy,
    escalationAccuracy,
    falseAllowRate,
    falseBlockRate,
    categoryStats
  }, null, 2)
);
console.log("\nResults saved to dataset/evaluation_results.json");
