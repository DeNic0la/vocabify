import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AuthService } from './services/auth.service';
import { LobbyService } from './services/lobby.service';
import { GameService } from './services/game.service';
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.lobby = functions
  .runWith({ secrets: ['OPENAI_API_KEY'] })
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== 'POST') res.status(400).send('Bad request');
      const authService = new AuthService();
      const idToken = await authService.validateFirebaseIdToken(req);
      if (!idToken) res.status(403).send('Unauthorized');

      try {
        const lobbyService = new LobbyService();
        const uid = idToken?.uid || '';
        const lobby = await lobbyService.createLobby(uid);
        await lobbyService.join(uid, lobby.id);
        res.status(200).send({ lobbyId: lobby.id });
      } catch (error) {
        res.status(500).send('Internal Server error.');
      }
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

    try {
      await lobbyService.join(uid, req.body.lobbyid);
    } catch (error: any) {
      res.status(500).send(error.message);
    }

    res.status(200).send();
  });
});

exports.leave = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' || !req.body.lobbyid)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    const lobbyService = new LobbyService();
    const uid = idToken?.uid || '';

    try {
      await lobbyService.leave(uid, req.body.lobbyid);
    } catch (error: any) {
      res.status(500).send(error.message);
    }

    res.status(200).send();
  });
});

exports.kick = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'DELETE' || !req.body.lobbyid || !req.body.kick_uid)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    const lobbyService = new LobbyService();
    const uid = idToken?.uid || '';

    try {
      await lobbyService.kick(uid, req.body.lobbyid, req.body.kick_uid);
    } catch (error: any) {
      res.status(500).send(error.message);
    }

    res.status(200).send();
  });
});

exports.start = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' || !req.body.lobbyId)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    try {
      const lobbyService = new LobbyService();
      const uid = idToken?.uid || '';
      await lobbyService.start(uid, req.body.lobbyId);

      res.status(200).send();
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });
});

exports.submit = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST' || !req.body.lobbyId || !req.body.sentence)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    try {
      const gameService = new GameService();
      const uid = idToken?.uid || '';
      await gameService.submit(uid, req.body.lobbyId, req.body.sentence);

      res.status(200).send();
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });
});
