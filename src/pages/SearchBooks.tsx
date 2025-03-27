
import React, { useState } from 'react';
import BookSearch from '@/components/books/BookSearch';
import { Book, ReadingLog } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';
import { getReadingLogForBook } from '@/utils/api';
import BookCard from '@/components/ui/BookCard';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const SearchBooks = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [booksWithStatus, setBooksWithStatus] = useState<Map<string, ReadingLog>>(new Map());
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchResults = async (results: Book[]) => {
    setSearchResults(results);
    setHasSearched(true);
    
    if (user) {
      // Fetch reading status for each book in the search results
      const statusMap = new Map<string, ReadingLog>();
      
      for (const book of results) {
        try {
          const log = await getReadingLogForBook(user.id, book.id);
          if (log) {
            statusMap.set(book.id, log);
          }
        } catch (error) {
          console.error(`Error fetching reading log for book ${book.id}:`, error);
        }
      }
      
      setBooksWithStatus(statusMap);
    }
  };

  const getBookWithReadingStatus = (book: Book) => {
    const readingLog = booksWithStatus.get(book.id);
    return {
      ...book,
      readingLog: readingLog,
    };
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-serif font-medium text-center mb-2">Find Books</h1>
      <p className="text-muted-foreground text-center mb-8">
        Search for books by title or author
      </p>
      
      <div className="mb-10">
        <BookSearch onSearchResults={handleSearchResults} />
      </div>
      
      {hasSearched && searchResults.length === 0 ? (
        <div className="text-center py-16 bg-secondary/50 rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-serif mb-2">No books found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any books matching your search. Try with a different title or author.
          </p>
          <Link to="/add-book">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add a New Book
            </Button>
          </Link>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h2 className="text-xl font-serif mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((book) => (
              <BookCard key={book.id} book={getBookWithReadingStatus(book)} />
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No results to display</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground/60 mx-auto mb-4" />
          <h3 className="text-xl font-serif mb-2">Ready to explore books</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-2">
            Type in the search box above to find books
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
            Or add a new book if you can't find what you're looking for
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
