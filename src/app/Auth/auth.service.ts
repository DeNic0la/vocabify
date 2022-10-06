import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import * as firebase from 'firebase/compat/app';
import { User } from './types/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Represents the currently logged-in User
   */
  public currentUser: Observable<User | undefined | null>;

  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {
    this.currentUser = this.fireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.fireStore
            .collection<User>('users')
            .doc(user.uid)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Creates user from Email and Password, adds the Username to the Firestore
   */
  public async createAccount(
    username: string,
    email: string,
    password: string
  ) {
    const userCredential = await this.fireAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    let uid = userCredential.user?.uid;
    if (!uid) {
      throw new Error('Could not create user on firebase');
    }
    const user: User = { uid, username, email };
    await this.fireStore.collection('users').doc(user.uid).set(user);
  }

  /**
   * Login with Email and Password
   * @param email
   * @param password
   */
  public async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Verifies the oobCode sent from firebase reset link
   * @param oobCode
   */
  public async verifyPasswordResetCode(oobCode: string): Promise<string> {
    return await firebase.default.auth().verifyPasswordResetCode(oobCode);
  }

  /**
   * Resets the password
   * @param oobCode
   * @param password
   */
  public async resetPassword(oobCode: string, password: string) {
    await firebase.default.auth().confirmPasswordReset(oobCode, password);
  }

  /**
   * Validates the password
   * @param password
   */
  public validatePassword(password: string, repeatedPassword?: string) {
    if (repeatedPassword) {
      if (password !== repeatedPassword) {
        throw new Error("The passwords doesn't match!")
      }
    }
    if (password.trim().length >= 6) {
      throw new Error('The password has to be longer than 6 characters.');
    }
  }

  public async sendPasswordReset(email: string) {
    await this.fireAuth.sendPasswordResetEmail(email);
  }
}
