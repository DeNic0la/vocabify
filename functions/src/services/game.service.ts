import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { AiService } from './ai.service';
import { Round } from '../types/round';
import { Story } from '../types/story';
import { Participant } from '../types/participant';

export class GameService {
  private db = admin.firestore();
  private aiService = new AiService();

  public async submit(uid: string, lobby: Lobby, sentence: string) {
    if (lobby.state === LobbyState.SUBMITTING) {
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
      (lobby.state === LobbyState.EVALUATED &&
        state === LobbyState.SUBMITTING) ||
      (lobby.state === LobbyState.JOINING && state === LobbyState.SUBMITTING)
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
      if (bestSentence.includes(firebaseSentences[i].sentence)) {
        await this.db
          .collection('lobbies')
          .doc(lobby.id)
          .collection('rounds')
          .doc(round.id)
          .update({ winner: i });
        lobby.story.push({
          uid: firebaseSentences[i].uid,
          sentence: firebaseSentences[i].sentence,
        });
        await this.db
          .collection('lobbies')
          .doc(lobby.id)
          .update({ story: lobby.story });
        this.addPoints(firebaseSentences[i].uid, lobby.id);
        break;
      }
    }
  }

  private async addPoints(uid: string, lobbyId: string) {
    const participantRef = this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('participants')
      .doc(uid);
    const particpant = <Participant>(await participantRef.get()).data();
    await participantRef.update({ points: particpant.points + 50 });
  }

  private async createRound(lobbyId: string) {
    const round: Round = {
      createdAt: Date.now(),
      submittedStories: [],
      winner: -1,
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
      .set(round, { merge: true });
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
