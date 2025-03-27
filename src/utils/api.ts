
import { supabase } from "@/integrations/supabase/client";
import { Book, ReadingLog, ReadingStatus, User } from './types';

// User-related functions
export const signUp = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  if (!data.user) {
    throw new Error('No user returned from signup');
  }
  
  return {
    id: data.user.id,
    email: data.user.email!
  };
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  if (!data.user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name
  };
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return {
    id: data.session.user.id,
    email: data.session.user.email!,
    name: data.session.user.user_metadata?.name
  };
};

// Book-related functions
export const getBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

export const getBookById = async (id: string): Promise<Book | null> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const addBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  const { data, error } = await supabase
    .from('books')
    .insert(bookData)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  const searchQuery = query.toLowerCase();
  
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

// Reading log functions
export const getUserReadingLogs = async (userId: string): Promise<ReadingLog[]> => {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  // Ensure status is of type ReadingStatus
  return (data || []).map(log => ({
    ...log,
    status: log.status as ReadingStatus
  }));
};

export const addToReadingLog = async (logData: Omit<ReadingLog, 'id'>): Promise<ReadingLog> => {
  // Check if an entry already exists
  const { data: existingLogs } = await supabase
    .from('reading_logs')
    .select('id')
    .eq('user_id', logData.user_id)
    .eq('book_id', logData.book_id)
    .maybeSingle();
  
  let response;
  
  if (existingLogs) {
    // Update existing log
    response = await supabase
      .from('reading_logs')
      .update(logData)
      .eq('id', existingLogs.id)
      .select()
      .single();
  } else {
    // Insert new log
    response = await supabase
      .from('reading_logs')
      .insert(logData)
      .select()
      .single();
  }
  
  if (response.error) {
    throw response.error;
  }
  
  // Ensure status is of type ReadingStatus
  return {
    ...response.data,
    status: response.data.status as ReadingStatus
  };
};

export const updateReadingLog = async (id: string, logData: Partial<ReadingLog>): Promise<ReadingLog> => {
  const { data, error } = await supabase
    .from('reading_logs')
    .update(logData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  // Ensure status is of type ReadingStatus
  return {
    ...data,
    status: data.status as ReadingStatus
  };
};

export const getReadingLogForBook = async (userId: string, bookId: string): Promise<ReadingLog | null> => {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .maybeSingle();
  
  if (error) {
    throw error;
  }
  
  if (!data) return null;
  
  // Ensure status is of type ReadingStatus
  return {
    ...data,
    status: data.status as ReadingStatus
  };
};

export const getUserBooksWithStatus = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('reading_logs')
    .select(`
      *,
      book:books(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    throw error;
  }
  
  // Ensure status is of type ReadingStatus for each reading log
  return (data || []).map(item => ({
    ...item,
    status: item.status as ReadingStatus
  }));
};
