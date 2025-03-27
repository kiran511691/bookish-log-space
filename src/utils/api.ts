
import { Book, ReadingLog, User } from './types';

// For now, we're using local storage to simulate a database
// In a real application, these would be fetch calls to a backend API

// User-related functions
export const signUp = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        reject(new Error('User already exists'));
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        email
      };
      
      // Store user (in a real app, we'd hash the password)
      const updatedUsers = [...users, { ...newUser, password }];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Store in session
      sessionStorage.setItem('currentUser', JSON.stringify(newUser));
      
      resolve(newUser);
    } catch (error) {
      reject(error);
    }
  });
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    try {
      // Retrieve users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        reject(new Error('Invalid credentials'));
        return;
      }
      
      // Store in session
      const userData: User = { id: user.id, email: user.email, name: user.name };
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    sessionStorage.removeItem('currentUser');
    resolve();
  });
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Book-related functions
export const getBooks = (): Promise<Book[]> => {
  return new Promise((resolve) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    resolve(books);
  });
};

export const getBookById = (id: string): Promise<Book | null> => {
  return new Promise((resolve) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const book = books.find((b: Book) => b.id === id) || null;
    resolve(book);
  });
};

export const addBook = (bookData: Omit<Book, 'id'>): Promise<Book> => {
  return new Promise((resolve) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID()
    };
    
    localStorage.setItem('books', JSON.stringify([...books, newBook]));
    resolve(newBook);
  });
};

export const searchBooks = (query: string): Promise<Book[]> => {
  return new Promise((resolve) => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const searchQuery = query.toLowerCase();
    
    const results = books.filter((book: Book) => 
      book.title.toLowerCase().includes(searchQuery) || 
      book.author.toLowerCase().includes(searchQuery)
    );
    
    resolve(results);
  });
};

// Reading log functions
export const getUserReadingLogs = (userId: string): Promise<ReadingLog[]> => {
  return new Promise((resolve) => {
    const logs = JSON.parse(localStorage.getItem('readingLogs') || '[]');
    const userLogs = logs.filter((log: ReadingLog) => log.user_id === userId);
    resolve(userLogs);
  });
};

export const addToReadingLog = (logData: Omit<ReadingLog, 'id'>): Promise<ReadingLog> => {
  return new Promise((resolve) => {
    const logs = JSON.parse(localStorage.getItem('readingLogs') || '[]');
    
    // Check if book already exists in user's reading log
    const existingLogIndex = logs.findIndex(
      (log: ReadingLog) => log.user_id === logData.user_id && log.book_id === logData.book_id
    );
    
    const newLog: ReadingLog = {
      ...logData,
      id: crypto.randomUUID()
    };
    
    let updatedLogs = [...logs];
    
    if (existingLogIndex >= 0) {
      // Update existing log
      updatedLogs[existingLogIndex] = newLog;
    } else {
      // Add new log
      updatedLogs.push(newLog);
    }
    
    localStorage.setItem('readingLogs', JSON.stringify(updatedLogs));
    resolve(newLog);
  });
};

export const updateReadingLog = (id: string, logData: Partial<ReadingLog>): Promise<ReadingLog> => {
  return new Promise((resolve, reject) => {
    const logs = JSON.parse(localStorage.getItem('readingLogs') || '[]');
    const logIndex = logs.findIndex((log: ReadingLog) => log.id === id);
    
    if (logIndex === -1) {
      reject(new Error('Reading log not found'));
      return;
    }
    
    const updatedLog = { ...logs[logIndex], ...logData };
    logs[logIndex] = updatedLog;
    
    localStorage.setItem('readingLogs', JSON.stringify(logs));
    resolve(updatedLog);
  });
};

export const getReadingLogForBook = (userId: string, bookId: string): Promise<ReadingLog | null> => {
  return new Promise((resolve) => {
    const logs = JSON.parse(localStorage.getItem('readingLogs') || '[]');
    const log = logs.find(
      (log: ReadingLog) => log.user_id === userId && log.book_id === bookId
    ) || null;
    
    resolve(log);
  });
};

export const getUserBooksWithStatus = async (userId: string): Promise<any[]> => {
  const userLogs = await getUserReadingLogs(userId);
  const allBooks = await getBooks();
  
  // Create a map for quick book lookup
  const booksMap = new Map(allBooks.map(book => [book.id, book]));
  
  // Combine reading logs with book details
  return userLogs.map(log => ({
    ...log,
    book: booksMap.get(log.book_id)
  }));
};
