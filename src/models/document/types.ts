export interface Document {
  _id?: string
  title: string
  description: string
  type: Type
  file: string
  researchArea: string
  library: string
  date: Date,
  language: Language
  authors: string[]
  keywords: string[]
  createdAt?: Date
  updatedAt?: Date
}

export enum Type {
  ARTIGO = 'ARTIGO',
  MONOGRAFIA = 'MONOGRAFIA',
  TESE = 'TESE',
  LIVRO = 'LIVRO',
  DISSERTACOES = 'DISSERTAÇÕES'
}

export enum Language {
  PT = 'pt',
  EN = 'en',
  ES = 'es'
}
 