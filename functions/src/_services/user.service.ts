import * as admin from "firebase-admin";
import { User } from "../_types/user";

export class UserService {
  db = admin.firestore();

  async getUser(uid: string): Promise<User> {
    return <User>(await this.db.collection('users').doc(uid).get()).data();
  }
}
