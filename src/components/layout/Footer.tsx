
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary py-8 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <BookOpen className="h-6 w-6 text-accent mr-2" />
            <span className="font-serif text-lg font-medium">My Reading Nook</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/search" className="hover:text-foreground transition-colors">
              Search Books
            </Link>
            <Link to="/add-book" className="hover:text-foreground transition-colors">
              Add Book
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} My Reading Nook. All rights reserved.</p>
          <p className="mt-1">
            Track your reading journey with a personal library.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
