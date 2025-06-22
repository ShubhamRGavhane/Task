import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { NotesStore } from '../store/notes.store';
import { Note } from '../modals/note.modal';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  template: `
    <h2 style="display: flex; align-items: center; gap: 10px;">
      <img src="https://img.icons8.com/color/48/note.png" width="24" height="24" />
      Notes
    </h2>

    <div *ngIf="notes().length === 0" style="color: gray;">No notes found.</div>

    <div *ngFor="let note of notes(); let i = index"
         style="margin-bottom: 1rem; border: 1px solid #ccc; padding: 10px; border-radius: 8px; background: #fafafa;">
      <h3 style="margin: 0 0 5px 0; font-size: 18px;">{{ i + 1 }}. {{ note.title }}</h3>
      <p style="margin: 0 0 10px 0; color: #555;">Note: {{ note.content }}</p>
      <div>
        <button (click)="startEdit(note)" style="margin-right: 5px;">✏️ Edit</button>
        <button (click)="deleteNote(note.id)">🗑️ Delete</button>
      </div>
    </div>

    <hr style="margin: 2rem 0;" />

    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px;">
      <input 
        [(ngModel)]="title"
        placeholder="Title"
        style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;"
      />
      <textarea 
        [(ngModel)]="content"
        rows="3"
        placeholder="Content"
        style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; resize: vertical;"
      ></textarea>
      <button 
        (click)="saveNote()"
        style="padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;"
      >
        {{ isEditing ? '✅ Update' : '➕ Add' }}
      </button>
    </div>
  `
})
export class HomePage implements OnInit {
  private notesService = inject(NotesService);
  private store = inject(NotesStore);

  title = '';
  content = '';
  isEditing = false;
  editingNoteId: string | null = null;
  editingNoteVersion: number | null = null;

  notes = computed(() => this.store.notes());

  ngOnInit() {
    const cachedNotes = localStorage.getItem('notes');
    if (cachedNotes) {
      this.store.setNotes(JSON.parse(cachedNotes));
    }

    this.notesService.getNotes().subscribe((notes: Note[]) => {
      const sorted = notes.sort((a, b) => a.updatedAt?.seconds - b.updatedAt?.seconds);
      this.store.setNotes(sorted);
      localStorage.setItem('notes', JSON.stringify(sorted));
    });
  }

  saveNote() {
    if (!this.title || !this.content) return;

    if (this.isEditing && this.editingNoteId) {
      this.notesService.updateNote(
        this.editingNoteId,
        this.title,
        this.content,
        this.editingNoteVersion ?? 1
      );
    } else {
      this.notesService.addNote(this.title, this.content);
    }

    this.title = '';
    this.content = '';
    this.isEditing = false;
    this.editingNoteId = null;
    this.editingNoteVersion = null;
  }

  deleteNote(id: string) {
    this.notesService.deleteNote(id);

    if (this.isEditing && this.editingNoteId === id) {
      this.cancelEdit();
    }
  }

  startEdit(note: Note) {
    this.title = note.title;
    this.content = note.content;
    this.editingNoteId = note.id;
    this.editingNoteVersion = note.version;
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingNoteId = null;
    this.editingNoteVersion = null;
    this.title = '';
    this.content = '';
  }
}
