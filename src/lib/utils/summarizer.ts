import { SummarizerManager } from "node-summarizer";

interface SummaryOptions {
  sentences?: number;
  algorithm?: 'textrank' | 'lex';
}

export class TextSummarizer {
  private static instance: TextSummarizer;
  
  private constructor() {}

  public static getInstance(): TextSummarizer {
    if (!TextSummarizer.instance) {
      TextSummarizer.instance = new TextSummarizer();
    }
    return TextSummarizer.instance;
  }

  public async summarize(text: string, options: SummaryOptions = {}): Promise<string> {
    try {
      const {
        sentences = 3,
        algorithm = 'textrank',
      } = options;

      if (!text || text.trim().length === 0) {
        throw new Error('Empty text provided');
      }

      const summarizer = new SummarizerManager(text, sentences);
      let summary: string;

      if (algorithm === 'textrank') {
        summary = await summarizer.getSummaryByRank();
      } else {
        summary = await summarizer.getSummaryByFrequency();
      }

      return summary;
    } catch (error) {
      console.error('Summarization failed:', error);
      throw error;
    }
  }
}

export const summarizer = TextSummarizer.getInstance();
