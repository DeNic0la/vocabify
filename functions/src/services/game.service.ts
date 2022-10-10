import * as admin from 'firebase-admin';
import { LobbyState } from '../types/lobby';
import { Round } from '../types/round';
import { Story } from '../types/story';
import { LobbyService } from './lobby.service';

export class GameService {
  private db = admin.firestore();
  private lobbyService = new LobbyService();

  public async submit(uid: string, lobbyId: string, sentence: string) {
    const lobby = await this.lobbyService.getLobby(lobbyId);
    if (lobby.state === LobbyState.IN_PROGRESS) {
      const story: Story = {
        uid,
        sentence,
      }
      const firebaseRound = await (await this.db.collection('lobbies').doc(lobbyId).collection('rounds').orderBy('createdAt').limitToLast(1).get()).docs[0];
      if (!firebaseRound.exists) {
        throw new Error('You cannot submit your sentence in the current lobby state')
      }
      let submittedStories = firebaseRound.data().submittedStories;
      submittedStories.push(story);
      await this.db.collection('lobbies').doc(lobbyId).collection('rounds').doc(firebaseRound.id).update({ submittedStories });
    } else {
      throw new Error('You cannot submit your sentence in the current lobby state');
    }
  }

  public async createRound(lobbyId: string) {
    const round: Round = {
      createdAt: Date.now(),
      submittedStories: [],
      winner: undefined,
    }
    const numberOfRounds = (await this.db.collection('lobbies').doc(lobbyId).collection('rounds').listDocuments()).length;
    await this.db.collection('lobbies').doc(lobbyId).collection('rounds').doc('round_' + numberOfRounds).create(round);
  }
}
