import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AuthService } from "./_services/auth.service";
import { UserService } from "./_services/user.service";
import { LobbyService } from "./_services/lobby.service";
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.lobby = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    const userService = new UserService();
    const lobbyService = new LobbyService();
    const uid = idToken?.uid || '';
    const user = await userService.getUser(uid);
    const lobby = await lobbyService.createLobby(user);

    res.status(200).send({ id: lobby.id });
  });
});
