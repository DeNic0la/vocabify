import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { User } from './types/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: firebase.User | undefined;

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
          this.user = user;
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
    password: string,
    repeatedpassword: string
  ) {
    if (username.trim().length == 0) {
      throw new Error('Please enter an username.');
    }
    this.validateEmail(email);
    this.validatePassword(password);
    if (password != repeatedpassword) {
      throw new Error('The passwords did not match each other');
    }
    const userCredential = await this.fireAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    let uid = userCredential.user?.uid;
    if (!uid) {
      throw new Error('Could not create user on firebase');
    }
    const user: User = { uid, username: username.trim(), email };
    await this.fireStore.collection('users').doc(user.uid).set(user);
  }

  /**
   * Login with Email and Password
   * @param email
   * @param password
   */
  public async login(email: string, password: string) {
    this.validateEmail(email);
    this.validatePassword(password);
    await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Verifies the oobCode sent from firebase reset link
   * @param oobCode
   */
  public async verifyPasswordResetCode(oobCode: string): Promise<string> {
    return await firebase.auth().verifyPasswordResetCode(oobCode);
  }

  /**
   * Resets the password
   * @param oobCode
   * @param password
   */
  public async resetPassword(oobCode: string, password: string) {
    this.validatePassword(password);
    await firebase.auth().confirmPasswordReset(oobCode, password);
  }

  private validatePassword(password: string) {
    if (password.trim().length <= 6) {
      throw new Error('The password has to be longer than 6 characters.');
    }
  }

  private validateEmail(email: string) {
    if (!RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}').test(email)) {
      throw new Error('The email is badly formatted.');
    }
  }

  public async sendPasswordReset(email: string) {
    this.validateEmail(email);
    await this.fireAuth.sendPasswordResetEmail(email);
  }

  async getToken(): Promise<string> {
    if (this.user) {
      return await this.user.getIdToken();
    }
    throw new Error('User not logged in.');
  }
}
