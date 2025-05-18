import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { User } from '../model/user.model';
import { Firestore, collection, collectionData, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersCollection = 'Users';

  constructor(private firestore: Firestore) { }

  getUserById(id: string): Observable<User> {
    const userRef = doc(this.firestore, `${this.usersCollection}/${id}`);
    return docData(userRef, { idField: 'id' }) as Observable<User>;
  }

  isAdmin(userId: string): Observable<boolean> {
    return this.getUserById(userId).pipe(
      map(user => user?.role === 'admin')
    );
  }

  createUser(user: User): Promise<void> {
    const userRef = doc(this.firestore, `${this.usersCollection}/${user.id}`);
    return setDoc(userRef, user);
  }

  updateUser(id: string, user: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `${this.usersCollection}/${id}`);
    return updateDoc(userRef, user);
  }


  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, this.usersCollection);
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }
}
