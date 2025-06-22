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
} from '@angular/fire/firestore';
import {
  CollectionReference,
  DocumentData,
  enableMultiTabIndexedDbPersistence,
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private firestore = inject(Firestore);
  private notesRef = collection(this.firestore, 'notes') as CollectionReference<DocumentData>;

  constructor() {
    // ✅ Enable offline persistence with multi-tab support
    enableMultiTabIndexedDbPersistence(this.firestore).catch((err) => {
      console.warn('❗ Offline persistence failed:', err.code);
    });
  }

  getNotes() {
    return collectionData(this.notesRef, { idField: 'id' }) as any;
  }

  addNote(title: string, content: string) {
    return addDoc(this.notesRef, {
      title,
      content,
      updatedAt: serverTimestamp(),
      version: 1,
    });
  }

  updateNote(id: string, title: string, content: string, version: number) {
    return updateDoc(doc(this.notesRef, id), {
      title,
      content,
      updatedAt: serverTimestamp(),
      version: version + 1,
    });
  }

  deleteNote(id: string) {
    return deleteDoc(doc(this.notesRef, id));
  }
}
