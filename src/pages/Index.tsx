
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, BookOpenCheck, Library, Search } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-secondary/30 -z-10"></div>
          <div 
            className="absolute inset-0 opacity-10 -z-10 bg-repeat"
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"currentColor\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')" 
            }}
          ></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 animate-fade-in">
                Your Personal 
                <span className="text-primary block mt-2">Reading Nook</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Track your reading journey, organize your personal library, and discover new books.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to My Library
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-12">
              Everything You Need for Your Reading Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="h-16 w-16 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Track Your Reading</h3>
                <p className="text-muted-foreground">
                  Keep track of books you want to read, are currently reading, or have finished reading.
                </p>
              </div>
              
              <div className="glass-card p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="h-16 w-16 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                  <Library className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Organize Your Library</h3>
                <p className="text-muted-foreground">
                  Build your personal book collection and organize titles by reading status.
                </p>
              </div>
              
              <div className="glass-card p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="h-16 w-16 flex items-center justify-center bg-primary/10 rounded-full mb-6">
                  <BookOpenCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">Record Your Thoughts</h3>
                <p className="text-muted-foreground">
                  Add notes, ratings, and reading dates to create a complete reading journal.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Start Building Your Reading Collection Today
              </h2>
              <p className="text-muted-foreground text-xl mb-8">
                Join thousands of readers who track their literary journeys with My Reading Nook.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg">View My Library</Button>
                    </Link>
                    <Link to="/search">
                      <Button variant="outline" size="lg">
                        <Search className="mr-2 h-4 w-4" />
                        Search Books
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg">Create Free Account</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg">Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
