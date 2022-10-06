import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './types/User';
import { Observable, of, switchMap } from 'rxjs';

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
}
