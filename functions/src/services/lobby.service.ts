import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { Participant } from '../types/participant';
import { AiService } from './ai.service';
import { User } from '../types/user';

export class LobbyService {
  private db = admin.firestore();
  private aiService = new AiService();

  public async createLobby(user: User, topic: string): Promise<Lobby> {
    try {
      const lobby: Lobby = {
        id: Date.now().toString(),
        hostid: user.uid,
        name: user.username + "'s Lobby",
        story: [await this.aiService.getStory(topic)],
        state: LobbyState.JOINING,
      };
      await this.db.collection('lobbies').doc(lobby.id).create(lobby);
      return lobby;
    } catch (error) {
      throw new Error('Internal Server Error.');
    }
  }

  public async join(user: User, lobby: Lobby) {
    if (lobby.state == LobbyState.IN_PROGRESS) {
      throw new Error('The lobby is already in progress.');
    }
    const particpant: Participant = {
      uid: user.uid,
      username: user.username,
      points: 0,
    };
    try {
      await this.db
        .collection('lobbies')
        .doc(lobby.id)
        .collection('participants')
        .doc(user.uid)
        .set(particpant, { merge: true });
    } catch (error) {
      throw new Error('Internal Server error.');
    }
  }

  public async leave(uid: string, lobby: Lobby) {
    await this.db
      .collection('lobbies')
      .doc(lobby.id)
      .collection('participants')
      .doc(uid)
      .delete();

    const participants = await this.getParticipants(lobby.id);
    if (participants.length == 0) {
      await this.deleteLobby(lobby.id);
    } else if (uid === lobby.hostid) {
      await this.setNewHost(participants[0].uid, lobby.id);
    }
  }

  public async kick(uid: string, lobby: Lobby, kick_uid: string) {
    if (lobby.hostid !== uid) {
      throw new Error('Unauthorized');
    }
    await this.leave(kick_uid, lobby);
  }

  public async getLobby(id: string): Promise<Lobby> {
    const lobby = <Lobby>(
      (await this.db.collection('lobbies').doc(id).get()).data()
    );
    if (!lobby) {
      throw new Error('The lobby does not exist.');
    }
    return lobby;
  }

  private async getParticipants(lobbyId: string) {
    let participants: Participant[] = [];
    const firebaseParticpants = await this.db
      .collection('lobbies')
      .doc(lobbyId)
      .collection('participants')
      .get();
    for (let firebaseParticpant of firebaseParticpants.docs) {
      const participant: Participant = {
        uid: firebaseParticpant.data().uid,
        username: firebaseParticpant.data().username,
        points: firebaseParticpant.data().points,
      };
      participants.push(participant);
    }
    return participants;
  }

  private async deleteLobby(lobbyId: string) {
    await this.db.collection('lobbies').doc(lobbyId).delete();
  }

  private async setNewHost(uid: string, lobbyId: string) {
    await this.db.collection('lobbies').doc(lobbyId).update({ hostid: uid });
  }
}
