import { CompletionRequest, EngineName, OpenAI } from '@dalenguyen/openai';
import { Lobby } from '../types/lobby';
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
      userRatings: [],
    };
  }

  public async getSortedSentences(sentences: string[], lobby: Lobby) {
    const completionRequest: CompletionRequest = {
      prompt: this.getPrompt(sentences, lobby.story),
      temperature: 0.6,
      max_tokens: 300,
    };
    const result = await openAI.createCompletion(
      EngineName.TextDavinci,
      completionRequest
    );
    return result.choices[0].text;
  }

  private getPrompt(sentences: string[], story: Story[]): string {
    let prompt =
      'Rank the sentences from best to worst without changing any of the sentences. Reward longer sentences. Sentences: [';
    for (let sentence of sentences) {
      let senArray: string[];
      let symbol: string = '.';

      if (sentence.includes('!')) {
        senArray = sentence.split('!');
        symbol = '!';
      } else if (sentence.includes('?')) {
        senArray = sentence.split('?');
        symbol = '?';
      } else {
        senArray = sentence.split('.');
      }

      prompt =
        prompt +
        '"' +
        story[story.length - 1].sentence.trim() +
        ' ' +
        senArray[0].trim() +
        symbol +
        '", ';
    }
    prompt += ']';
    return prompt;
  }
}
