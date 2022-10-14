import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { AiService } from './ai.service';
import { Round } from '../types/round';
import { Story } from '../types/story';
import { Participant } from '../types/participant';
import { LobbyService } from './lobby.service';

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

  public async evaluate(lobby: Lobby) {
    const round = await this.getLastRound(lobby.id);
    if (round.data().winner !== -1) {
      throw new Error('The evaluation was already triggered');
    }
    const firebaseSentences = round.data().submittedStories;
    const stories: string[] = [];
    for (let story of firebaseSentences) {
      stories.push(story.sentence);
    }

    let sortedSentences = '';
    let sortedArray: string[] = [];
    if (stories.length >= 1) {
      if (stories.length > 1) {
        sortedSentences = await this.aiService.getSortedSentences(stories);
      } else {
        sortedSentences = stories[0];
      }
      sortedArray = sortedSentences.split('\n');
    } else {
      await new LobbyService().deleteLobby(lobby.id);
      return;
    }

    const participants = await new LobbyService().getParticipants(lobby.id);
    let rank = participants.length;
    for (let x = 0; x < sortedArray.length; x++) {
      for (let i = 0; i < firebaseSentences.length; i++) {
        if (sortedArray[x].includes(firebaseSentences[i].sentence)) {
          if (rank === participants.length) {
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
          }
          await this.addPoints(firebaseSentences[i].uid, lobby.id, (rank * 50));
          rank--;
        }
      }
    }
    throw new Error('There was an error choosing the best sentence.');
  }

  private async addPoints(uid: string, lobbyId: string, points: number) {
    const participantRef = this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('participants')
      .doc(uid);
    const particpant = <Participant>(await participantRef.get()).data();
    await participantRef.update({ points: particpant.points + points });
  }

  private async createRound(lobbyId: string) {
    const round: Round = {
      createdAt: Date.now(),
      submittedStories: [],
      winner: -1,
    };
    await this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('rounds')
      .doc(Date.now().toString())
      .set(round, { merge: true });
  }

  private async getLastRound(lobbyId: string) {
    const firebaseRound = await (
      await this.db
        .collection('lobbies')
        .doc(lobbyId)
        .collection('rounds')
        .orderBy('createdAt', 'desc')
        .limit(1)
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
