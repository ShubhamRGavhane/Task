import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { NotesStore } from '../store/notes.store';
import { Note } from '../modals/note.modal';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>📝 Notes</h2>

    <div *ngFor="let note of notes()">
      <h3>{{ note.title }}</h3>
      <p>{{ note.content }}</p>
      <button (click)="editNote(note)">Edit</button>
      <button (click)="deleteNote(note.id)">Delete</button>
    </div>

    <hr />
    <input [(ngModel)]="title" placeholder="Title" />
    <textarea [(ngModel)]="content" placeholder="Content"></textarea>
    <button (click)="addNote()">Add</button>
  `
})
export class HomePage implements OnInit {
  private notesService = inject(NotesService);
  private store = inject(NotesStore);

  title = '';
  content = '';

  ngOnInit() {
    this.notesService.getNotes().subscribe((notes: Note[]) => {
      this.store.setNotes(notes);
    });
  }

  // Use signal for reactive UI updates
  notes = computed(() => this.store.notes());

  addNote() {
    const newNoteData = {
      title: this.title,
      content: this.content,
      updatedAt: serverTimestamp(),
      version: 1
    };

    this.notesService.addNote(this.title, this.content).then((docRef) => {
      // Optimistically update store
      const newNote: Note = {
        id: docRef.id,
        ...newNoteData
      };
      this.store.addNote(newNote); // 👈 this ensures instant UI update
    });

    this.title = '';
    this.content = '';
  }

  deleteNote(id: string) {
    this.notesService.deleteNote(id);
    this.store.deleteNote(id); // 👈 remove from UI instantly
  }

  editNote(note: Note) {
    const updatedContent = prompt('Edit Content:', note.content);
    if (updatedContent !== null) {
      const updatedNote = {
        ...note,
        content: updatedContent,
        version: note.version + 1,
        updatedAt: new Date()
      };
      this.notesService.updateNote(note.id, note.title, updatedContent, note.version);
      this.store.updateNote(updatedNote); // 👈 update UI instantly
    }
  }
}
