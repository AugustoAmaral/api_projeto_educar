import { model, Schema } from 'mongoose';
import { Library  } from './types';

export const librarySchema = new Schema<Library>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true }
}, {
  timestamps: true
});

export const LibraryModel = model<Library>('Library', librarySchema);
