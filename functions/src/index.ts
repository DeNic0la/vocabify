import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AuthService } from './services/auth.service';
import { LobbyService } from './services/lobby.service';
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.lobby = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    const lobbyService = new LobbyService();
    const uid = idToken?.uid || '';
    const lobby = await lobbyService.createLobby(uid);

    res.status(200).send({ id: lobby.id });
  });
});

exports.join = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' || !req.body.lobbyid)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    const lobbyService = new LobbyService();
    const uid = idToken?.uid || '';
    await lobbyService.join(uid, req.body.lobbyid);

    res.status(200).send();
  });
});
