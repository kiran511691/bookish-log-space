
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Search, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-serif font-semibold tracking-tight">My Reading Nook</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'text-primary font-medium after:w-full' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/search" 
                className={`nav-link ${isActive('/search') ? 'text-primary font-medium after:w-full' : ''}`}
              >
                Search
              </Link>
              <Link 
                to="/add-book" 
                className={`nav-link ${isActive('/add-book') ? 'text-primary font-medium after:w-full' : ''}`}
              >
                Add Book
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'text-primary font-medium after:w-full' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className={`nav-link ${isActive('/signup') ? 'text-primary font-medium after:w-full' : ''}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user.email}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground/80 hover:text-foreground"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <div className="flex items-center">
              <Link to="/search">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
