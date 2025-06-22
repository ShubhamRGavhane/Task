import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  serverTimestamp,
  CollectionReference,
  enableMultiTabIndexedDbPersistence,
} from '@angular/fire/firestore';
import { Note } from '../modals/note.modal';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private firestore = inject(Firestore);
  private notesRef = collection(this.firestore, 'notes') as CollectionReference<Note>;

  constructor() {
    enableMultiTabIndexedDbPersistence(this.firestore).catch((err) => {
      console.warn('Offline persistence failed:', err.code);
    });
  }

  getNotes() {
    return collectionData(this.notesRef, { idField: 'id' }) as Observable<Note[]>;
  }


  addNote(title: string, content: string) {
    return addDoc(this.notesRef, {
      title,
      content,
      updatedAt: serverTimestamp(),
      version: 1,
    } as any);
  }

  updateNote(id: string, title: string, content: string, version: number) {
    return updateDoc(doc(this.notesRef, id), {
      title,
      content,
      updatedAt: serverTimestamp(),
      version: version + 1,
    } as any);
  }

  deleteNote(id: string) {
    return deleteDoc(doc(this.notesRef, id));
  }
}
