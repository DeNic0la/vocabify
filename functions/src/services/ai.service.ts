import { CompletionRequest, EngineName, OpenAI } from '@dalenguyen/openai';
import { Story } from '../types/story';

const openAI = new OpenAI(process.env.OPENAI_API_KEY || '');

export class AiService {
  public async getStory(topic: string): Promise<Story> {
    const completionRequest: CompletionRequest = {
      prompt: `Write a beginning of a short story about a protagonist with the topic ${topic} that ends in a cliff hanger.`,
      temperature: 0.6,
    };
    const result = await openAI.createCompletion(
      EngineName.TextDavinci,
      completionRequest
    );
    return {
      uid: 'ai',
      sentence: result.choices[0].text,
    };
  }

  public async getBestSentence(sentences: string[]) {
    const completionRequest: CompletionRequest = {
      prompt: this.getPrompt(sentences),
      temperature: 0.6,
      max_tokens: 300,
    };
    const result = await openAI.createCompletion(
      EngineName.TextDavinci,
      completionRequest
    );
    return result.choices[0].text;
  }

  private getPrompt(sentences: string[]): string {
    let prompt =
      'Return the best sentence. Do not return the reasoning. ' +
      'Base the comparison off complexity, creativity, ' +
      'vocabulary and reward longer sentences.';
    for (const sentence of sentences) {
      prompt = prompt + '\nSentence: ' + sentence;
    }
    return prompt;
  }
}
