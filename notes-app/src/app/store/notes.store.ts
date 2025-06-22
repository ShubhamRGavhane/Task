import { signalStore, withState, withMethods } from '@ngrx/signals';
import { Note } from '../modals/note.modal';
import { WritableSignal } from '@angular/core';

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    notes: [] as Note[],
    loading: false,
    conflicts: [] as Note[],
  })),
  withMethods((store) => {
    // Cast the signals as WritableSignal<T> to enable .set() and .update()
    const notes = store.notes as WritableSignal<Note[]>;
    const loading = store.loading as WritableSignal<boolean>;
    const conflicts = store.conflicts as WritableSignal<Note[]>;

    return {
      setNotes(newNotes: Note[]) {
        notes.set(newNotes);
      },
      addNote(note: Note) {
        notes.update((prev) => [...prev, note]);
      },
      updateNote(note: Note) {
        notes.update((prev) =>
          prev.map((n) => (n.id === note.id ? note : n))
        );
      },
      deleteNote(id: string) {
        notes.update((prev) => prev.filter((n) => n.id !== id));
      },
      setLoading(value: boolean) {
        loading.set(value);
      },
    };
  })
);
