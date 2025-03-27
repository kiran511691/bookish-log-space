
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Book, ReadingLog } from '@/utils/types';
import { getBookById, getReadingLogForBook } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import ReadingLogForm from '@/components/books/ReadingLogForm';
import ReadingStatusBadge from '@/components/ui/ReadingStatusBadge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronLeft } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [readingLog, setReadingLog] = useState<ReadingLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReadingLogForm, setShowReadingLogForm] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        
        if (user) {
          const logData = await getReadingLogForBook(user.id, id);
          setReadingLog(logData);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id, user]);

  const handleReadingLogSuccess = (log: ReadingLog) => {
    setReadingLog(log);
    setShowReadingLogForm(false);
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse space-y-8 w-full max-w-3xl">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="flex space-x-8">
            <div className="h-64 w-44 bg-muted rounded"></div>
            <div className="space-y-4 flex-1">
              <div className="h-6 bg-muted rounded w-full"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page-container text-center">
        <h1 className="text-2xl font-serif mb-4">Book not found</h1>
        <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const defaultCoverUrl = 'https://via.placeholder.com/300x450?text=No+Cover';

  return (
    <div className="page-container animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-3 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="sticky top-24 book-cover rounded-lg overflow-hidden border border-border">
            <img 
              src={book.cover_image_url || defaultCoverUrl} 
              alt={`Cover of ${book.title}`}
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultCoverUrl;
              }}
            />
          </div>
          
          {readingLog && (
            <div className="mt-4 bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Your Reading Status</h3>
                <ReadingStatusBadge status={readingLog.status} size="md" />
              </div>
              
              {readingLog.rating && (
                <div className="mb-2">
                  <div className="text-sm text-muted-foreground mb-1">Your Rating</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < readingLog.rating! ? 'text-accent' : 'text-muted'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}
              
              {(readingLog.start_date || readingLog.finish_date) && (
                <div className="mt-2 text-sm">
                  {readingLog.start_date && (
                    <div className="mb-1">
                      <span className="text-muted-foreground">Started: </span>
                      {new Date(readingLog.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {readingLog.finish_date && (
                    <div>
                      <span className="text-muted-foreground">Finished: </span>
                      {new Date(readingLog.finish_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => setShowReadingLogForm(true)}
              >
                Update Status
              </Button>
            </div>
          )}
          
          {!readingLog && user && (
            <div className="mt-4">
              <Button 
                className="w-full"
                onClick={() => setShowReadingLogForm(true)}
              >
                Add to My Library
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-serif font-medium">{book.title}</h1>
          <h2 className="text-xl text-muted-foreground mt-2">{book.author}</h2>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {book.genre && (
              <span className="inline-block bg-secondary px-3 py-1 rounded-full text-secondary-foreground text-sm">
                {book.genre}
              </span>
            )}
            {book.publication_year && (
              <span className="inline-block bg-secondary px-3 py-1 rounded-full text-secondary-foreground text-sm">
                {book.publication_year}
              </span>
            )}
          </div>
          
          {readingLog?.notes && (
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium mb-2">Your Notes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{readingLog.notes}</p>
            </div>
          )}
          
          {showReadingLogForm && (
            <div className="mt-8 p-6 border rounded-lg bg-card">
              <h3 className="text-lg font-serif font-medium mb-4">
                {readingLog ? 'Update Reading Status' : 'Add to My Library'}
              </h3>
              <ReadingLogForm 
                bookId={book.id} 
                existingLog={readingLog || undefined}
                onSuccess={handleReadingLogSuccess}
              />
            </div>
          )}
          
          {!user && (
            <div className="mt-8 p-6 bg-secondary/50 rounded-lg text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">Track Your Reading</h3>
              <p className="text-muted-foreground mb-4">
                Sign in to add this book to your library and track your reading progress.
              </p>
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="link">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
