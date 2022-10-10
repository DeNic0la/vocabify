import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { AiService } from './ai.service';
import { Round } from '../types/round';
import { Story } from '../types/story';

export class GameService {
  private db = admin.firestore();
  private aiService = new AiService();

  public async submit(uid: string, lobby: Lobby, sentence: string) {
    if (lobby.state === LobbyState.IN_PROGRESS) {
      const story: Story = {
        uid,
        sentence,
      };
      const round = await this.getLastRound(lobby.id);
      let submittedStories = round.data().submittedStories;
      submittedStories.push(story);
      await this.db
        .collection('lobbies')
        .doc(lobby.id)
        .collection('rounds')
        .doc(round.id)
        .update({ submittedStories });
    } else {
      throw new Error(
        'You cannot submit your sentence in the current lobby state'
      );
    }
  }

  public async changeState(uid: string, lobby: Lobby, state: LobbyState) {
    if (lobby.hostid !== uid) {
      throw new Error('Not Authorized');
    }
    if (
      lobby.state === LobbyState.EVALUATING &&
      state === LobbyState.IN_PROGRESS
    ) {
      await this.createRound(lobby.id);
    }
    await this.db.collection('lobbies').doc(lobby.id).update({ state });
  }

  public async evaluate(uid: string, lobby: Lobby) {
    if (lobby.hostid !== uid) {
      throw new Error('Unauthorized');
    }

    const round = await this.getLastRound(lobby.id);
    const firebaseSentences = round.data().submittedStories;
    const stories: string[] = [];
    for (let story of firebaseSentences) {
      stories.push(story.sentence);
    }

    const bestSentence = await this.aiService.getBestSentence(stories);

    for (let i = 0; i < firebaseSentences.length; i++) {
      if (bestSentence === firebaseSentences[i].sentence) {
        await this.db.collection('lobbies').doc(lobby.id).collection('rounds').doc(round.id).update({ winner: i });
        lobby.story.push({ uid: firebaseSentences[i].uid, sentence: firebaseSentences[i].sentence })
        await this.db.collection('lobbies').doc(lobby.id).update({ story: lobby.story });
        break;
      }
    }

  }

  private async createRound(lobbyId: string) {
    const round: Round = {
      createdAt: Date.now(),
      submittedStories: [],
      winner: undefined,
    };
    const numberOfRounds = (
      await this.db
        .collection('lobbies')
        .doc(lobbyId)
        .collection('rounds')
        .listDocuments()
    ).length;
    await this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('rounds')
      .doc('round_' + numberOfRounds)
      .create(round);
  }

  private async getLastRound(lobbyId: string) {
    const firebaseRound = await (
      await this.db
        .collection('lobbies')
        .doc(lobbyId)
        .collection('rounds')
        .orderBy('createdAt')
        .limitToLast(1)
        .get()
    ).docs[0];
    if (!firebaseRound || !firebaseRound.exists) {
      throw new Error(
        'You cannot submit your sentence in the current lobby state'
      );
    }
    return firebaseRound;
  }
}
