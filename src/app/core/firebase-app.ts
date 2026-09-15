import { InjectionToken } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP', {
  providedIn: 'root',
  factory: () => initializeApp(firebaseConfig),
});
