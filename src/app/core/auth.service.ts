import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User, signInWithEmailAndPassword, setPersistence, inMemoryPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    // onAuthStateChanged(this.auth, user => this.user$.next(user));
    setPersistence(this.auth, inMemoryPersistence)
      .then(() => {
        onAuthStateChanged(this.auth, user => this.user$.next(user));
      });
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.user$.next(result.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error; // Propagar o erro para o componente
    }
  }

  async logout() {
    await signOut(this.auth);
    this.user$.next(null);
  }
}
