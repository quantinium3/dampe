import { summarizer } from "./summarizer";

const sampleText = `Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by animals including humans. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Some popular accounts use the term "artificial intelligence" to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".`;

async function testSummarization() {
  const summary = await summarizer.summarize(sampleText, { sentences: 2 });
  console.log("Summary:\n", summary);
}

testSummarization();
