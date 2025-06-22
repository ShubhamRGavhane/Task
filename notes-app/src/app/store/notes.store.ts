import { signal, computed, Injectable } from '@angular/core';
import { Note } from '../modals/note.modal';

@Injectable({ providedIn: 'root' })
export class NotesStore {
  private _notes = signal<Note[]>([]);
  readonly notes = computed(() => this._notes());

  setNotes(notes: Note[]) {
    this._notes.set(notes);
  }

  addNote(note: Note) {
    this._notes.update(n => [...n, note]);
  }

  updateNote(note: Note) {
    this._notes.update(n => n.map(x => x.id === note.id ? note : x));
  }

  deleteNote(id: string) {
    this._notes.update(n => n.filter(x => x.id !== id));
  }
}
