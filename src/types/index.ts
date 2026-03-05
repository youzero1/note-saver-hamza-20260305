export type NoteCategory = 'product' | 'supplier' | 'order' | 'inventory' | 'pricing' | 'general';
export type NotePriority = 'low' | 'medium' | 'high';

export interface NoteData {
  id: number;
  title: string;
  content: string;
  category: NoteCategory;
  priority: NotePriority;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  category: NoteCategory;
  priority: NotePriority;
  tags?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  category?: NoteCategory;
  priority?: NotePriority;
  tags?: string;
}

export interface NotesFilter {
  category?: NoteCategory;
  priority?: NotePriority;
  search?: string;
}
