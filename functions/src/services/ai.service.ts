import { CompletionRequest, EngineName, OpenAI } from '@dalenguyen/openai';
import { Story } from '../types/story';

const openAI = new OpenAI(process.env.OPENAI_API_KEY || '');

export class AiService {
  public async getStory(): Promise<Story> {
    const completionRequest: CompletionRequest = {
      prompt: `Write a beginning of a short story about a protagonist with the topic School that ends in a cliff hanger.`,
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
}
