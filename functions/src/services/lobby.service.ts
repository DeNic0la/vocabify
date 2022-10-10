import * as admin from 'firebase-admin';
import { Lobby, LobbyState } from '../types/lobby';
import { Participant } from '../types/participant';
import { UserService } from './user.service';

export class LobbyService {
  private db = admin.firestore();
  private userService = new UserService();

  public async createLobby(uid: string): Promise<Lobby> {
    try {
      const host = await this.userService.getUser(uid);
      const lobby: Lobby = {
        id: Date.now().toString(),
        hostid: host.uid,
        name: host.username + "'s Lobby",
        story: 'Lorem Ipsum Story',
        state: LobbyState.JOINING,
      };
      await this.db.collection('lobbies').doc(lobby.id).create(lobby);
      return lobby;
    } catch (error) {
      throw new Error('Internal Server Error.');
    }
  }

  public async join(uid: string, lobbyid: string) {
    const user = await this.userService.getUser(uid);
    const lobby = await this.getLobby(lobbyid);
    if (lobby.state == LobbyState.IN_PROGRESS) {
      throw new Error('The lobby is already in progress.');
    }
    const particpant: Participant = {
      uid: user.uid,
      username: user.username,
    };
    try {
      await this.db
        .collection('lobbies')
        .doc(lobbyid)
        .collection('participants')
        .doc(user.uid)
        .set(particpant, { merge: true });
    } catch (error) {
      throw new Error('Internal Server error.');
    }
  }

  public async start(uid: string, lobbyId: string) {
    const lobby = await this.getLobby(lobbyId);
    if (lobby.hostid === uid) {
      throw new Error('Not Authorized');
    }
    await this.db.collection('lobbies').doc(lobbyId).update({ state: LobbyState.IN_PROGRESS });
  }

  public async leave(uid: string, lobbyId: string) {
    await this.db.collection('lobbies').doc(lobbyId).collection('participants').doc(uid).delete();
  }

  private async getLobby(id: string): Promise<Lobby> {
    const lobby = <Lobby>(
      (await this.db.collection('lobbies').doc(id).get()).data()
    );
    if (!lobby) {
      throw new Error('The lobby does not exist.');
    }
    return lobby;
  }
}
