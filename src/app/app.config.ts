import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "angular-webshop-project", appId: "1:759366167011:web:dae29b1d25b63d024ed8d6", storageBucket: "angular-webshop-project.firebasestorage.app", apiKey: "AIzaSyBMPxnJG3-ZRF8Kpl8opFhPw81LSGenvYo", authDomain: "angular-webshop-project.firebaseapp.com", messagingSenderId: "759366167011" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
