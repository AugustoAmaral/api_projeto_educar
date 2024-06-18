import { model, Schema } from 'mongoose';
import { LibraryModel } from '../library';
import { Document, Type, Language  } from './types';

export const documentSchema = new Schema<Document>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Type, required: true },
  file: { type: String, required: true },
  researchArea: { type: String, required: true },
  library: {
    type: Schema.Types.ObjectId as any,
    ref: 'library',
    required: true
  },
  date: { type: Date, required: true },
  language: { type: String, enum: Language, required: true },
  authors: [{
    type: String,
    required: true
  }],
  keywords: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

export const DocumentModel = model<Document>('Document', documentSchema);
