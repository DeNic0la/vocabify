import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AuthService } from './services/auth.service';
import { LobbyService } from './services/lobby.service';
import { GameService } from './services/game.service';
import { LobbyState } from './types/lobby';
import { UserService } from './services/user.service';
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.lobby = functions
  .runWith({ secrets: ['OPENAI_API_KEY'] })
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (
        req.method !== 'POST' ||
        !req.body.topic ||
        !req.body.imgUrl ||
        req.body.filename === undefined
      )
        res.status(400).send('Bad request');
      const authService = new AuthService();
      const idToken = await authService.validateFirebaseIdToken(req);
      if (!idToken) res.status(403).send('Unauthorized');

      try {
        const lobbyService = new LobbyService();
        const userService = new UserService();
        const uid = idToken?.uid || '';

        const user = await userService.getUser(uid);
        const lobby = await lobbyService.createLobby(
          user,
          req.body.topic,
          req.body.imgUrl,
          req.body.filename
        );
        await lobbyService.join(user, lobby);

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
    const userService = new UserService();
    const uid = idToken?.uid || '';
    const user = await userService.getUser(uid);
    const lobby = await lobbyService.getLobby(req.body.lobbyid);

    try {
      await lobbyService.join(user, lobby);
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
    const lobby = await lobbyService.getLobby(req.body.lobbyid);

    try {
      await lobbyService.leave(uid, lobby);
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
    const lobby = await lobbyService.getLobby(req.body.lobbyid);

    try {
      await lobbyService.kick(uid, lobby, req.body.kick_uid);
    } catch (error: any) {
      res.status(500).send(error.message);
    }

    res.status(200).send();
  });
});

exports.state = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' || !req.body.lobbyId || !req.body.state)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    try {
      const gameService = new GameService();
      const lobbyService = new LobbyService();
      const lobby = await lobbyService.getLobby(req.body.lobbyId);
      const uid = idToken?.uid || '';
      const changeState: LobbyState = req.body.state;
      await gameService.changeState(uid, lobby, changeState);

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
      const lobbyService = new LobbyService();
      const uid = idToken?.uid || '';
      const lobby = await lobbyService.getLobby(req.body.lobbyId);
      await gameService.submit(uid, lobby, req.body.sentence);

      res.status(200).send();
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });
});

exports.evaluate = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PUT' || !req.body.lobbyId)
      res.status(400).send('Bad request');
    const authService = new AuthService();
    const idToken = await authService.validateFirebaseIdToken(req);
    if (!idToken) res.status(403).send('Unauthorized');

    try {
      const gameService = new GameService();
      const lobbyService = new LobbyService();
      const uid = idToken?.uid || '';

      const lobby = await lobbyService.getLobby(req.body.lobbyId);
      await gameService.changeState(uid, lobby, LobbyState.EVALUATING);
      await gameService.evaluate(lobby);
      await gameService.changeState(uid, lobby, LobbyState.EVALUATED);

      res.status(200).send();
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });
});

exports.lobbyDeletion = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const lobbyService = new LobbyService();
    await lobbyService.deleteAllLobbiesOlderThan24Hours();
    return null;
  });
