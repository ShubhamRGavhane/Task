// AuthService with signInAnonymously
import { inject, Injectable } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  async loginAnon() {
    try {
      await signInAnonymously(this.auth);
      console.log('✅ Logged in anonymously');
    } catch (e) {
      console.error('❌ Login failed', e);
    }
  }
}
