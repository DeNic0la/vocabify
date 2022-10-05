import * as admin from "firebase-admin";
import { Lobby } from "../_types/lobby";
import { Participant } from "../_types/participant";
import { UserService } from "./user.service";

export class LobbyService {
  private db = admin.firestore();
  private userService = new UserService();

  async createLobby(uid: string): Promise<Lobby> {
    const host = await this.userService.getUser(uid);
    const lobby: Lobby = {
      id: Date.now().toString(),
      hostid: host.uid,
      name: 'Lobby from ' + host.username,
    }
    await this.db.collection('lobbies').doc(lobby.id).create(lobby);
    return lobby;
  }

  async join(uid: string, lobbyid: string) {
    const user = await this.userService.getUser(uid);
    const particpant: Participant = {
      uid: user.uid,
      username: user.username,
    }
    await this.db.collection('lobbies').doc(lobbyid).collection('users').doc(user.uid).create(particpant);
  }
}
