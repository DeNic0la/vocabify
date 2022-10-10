import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { Round } from '../types/round';
import { Story } from '../types/story';

export class GameService {
  private db = admin.firestore();

  public async submit(uid: string, lobby: Lobby, sentence: string) {
    if (lobby.state === LobbyState.IN_PROGRESS) {
      const story: Story = {
        uid,
        sentence,
      };
      const firebaseRound = await (
        await this.db
          .collection('lobbies')
          .doc(lobby.id)
          .collection('rounds')
          .orderBy('createdAt')
          .limitToLast(1)
          .get()
      ).docs[0];
      if (!firebaseRound.exists) {
        throw new Error(
          'You cannot submit your sentence in the current lobby state'
        );
      }
      let submittedStories = firebaseRound.data().submittedStories;
      submittedStories.push(story);
      await this.db
        .collection('lobbies')
        .doc(lobby.id)
        .collection('rounds')
        .doc(firebaseRound.id)
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
}
