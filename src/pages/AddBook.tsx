
import React from 'react';
import BookForm from '@/components/books/BookForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/utils/types';

const AddBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookAdded = (book: Book) => {
    // When book is added, navigate to the book detail page
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-serif font-medium mb-2">Add a New Book</h1>
      <p className="text-muted-foreground mb-8">
        Fill in the details to add a new book to your collection
      </p>
      
      <div className="max-w-2xl mx-auto bg-card border rounded-lg p-6 md:p-8">
        <BookForm onSuccess={handleBookAdded} />
      </div>
    </div>
  );
};

export default AddBook;
