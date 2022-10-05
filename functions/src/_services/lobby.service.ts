import * as admin from "firebase-admin";
import { Lobby } from "../_types/lobby";
import { User } from "../_types/user";

export class LobbyService {
  db = admin.firestore();

  async createLobby(host: User): Promise<Lobby> {
    const lobby: Lobby = {
      id: Date.now().toString(),
      hostid: host.uid,
      name: 'Lobby from ' + host.username,
    }
    await this.db.collection('lobbies').doc(lobby.id).create(lobby);
    return lobby;
  }
}
