import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export class AuthService {

  async validateFirebaseIdToken(
    req: functions.https.Request,
  ): Promise<DecodedIdToken | undefined> {
    if (
      (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)
    ) {
      return;
    }

    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
      idToken = req.cookies.__session;
    } else {
      return;
    }

    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      return decodedIdToken;
    } catch (error) {
      return;
    }
  }
}
