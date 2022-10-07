import * as admin from 'firebase-admin';
import { User } from '../types/user';

export class UserService {
  private db = admin.firestore();

  async getUser(uid: string): Promise<User> {
    const user = <User>(await this.db.collection('users').doc(uid).get()).data();
    if (!user) {
      throw new Error('The user does not exist.');
    }
    return user;
  }
}
