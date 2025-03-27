
import React from 'react';
import { Link } from 'react-router-dom';
import { BookWithReadingStatus } from '@/utils/types';
import ReadingStatusBadge from './ReadingStatusBadge';

interface BookCardProps {
  book: BookWithReadingStatus;
  showStatus?: boolean;
}

const BookCard = ({ book, showStatus = true }: BookCardProps) => {
  const defaultCoverUrl = 'https://via.placeholder.com/200x300?text=No+Cover';

  return (
    <div className="book-card group animate-fade-in">
      <Link to={`/book/${book.id}`} className="block">
        <div className="book-cover">
          <img 
            src={book.cover_image_url || defaultCoverUrl} 
            alt={`Cover of ${book.title}`}
            className="book-cover-img"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultCoverUrl;
            }}
          />
          {showStatus && book.readingLog && (
            <div className="absolute top-2 right-2">
              <ReadingStatusBadge status={book.readingLog.status} />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-serif font-medium text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{book.author}</p>
          
          {book.genre && (
            <div className="mt-2">
              <span className="inline-block bg-secondary text-xs px-2 py-1 rounded text-secondary-foreground">
                {book.genre}
              </span>
            </div>
          )}
          
          {showStatus && book.readingLog && book.readingLog.rating && (
            <div className="mt-2 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-4 h-4 ${i < book.readingLog!.rating! ? 'text-accent' : 'text-muted'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
