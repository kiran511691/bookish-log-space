
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  cover_image_url?: string;
  publication_year?: number;
}

export type ReadingStatus = 'Want to Read' | 'Reading' | 'Read';

export interface ReadingLog {
  id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  rating?: number;
  start_date?: string;
  finish_date?: string;
  notes?: string;
  book?: Book;
}

export interface BookWithReadingStatus extends Book {
  readingLog?: ReadingLog;
}
