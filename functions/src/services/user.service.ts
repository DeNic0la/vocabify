import * as admin from 'firebase-admin';
import { User } from '../types/user';

export class UserService {
  private db = admin.firestore();

  async getUser(uid: string): Promise<User> {
    return <User>(await this.db.collection('users').doc(uid).get()).data();
  }
}
