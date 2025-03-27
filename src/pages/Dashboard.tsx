
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ReadingLog, ReadingStatus } from '@/utils/types';
import { getUserBooksWithStatus } from '@/utils/api';
import BookCard from '@/components/ui/BookCard';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReadingStatus | 'All'>('All');

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const logsWithBooks = await getUserBooksWithStatus(user.id);
        setReadingLogs(logsWithBooks);
      } catch (error) {
        console.error('Error fetching user books:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserBooks();
  }, [user]);

  const filteredLogs = activeTab === 'All' 
    ? readingLogs 
    : readingLogs.filter((log) => log.status === activeTab);

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">My Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your reading journey
          </p>
        </div>
        
        <Link to="/add-book">
          <Button className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="border-b">
          <div className="flex space-x-6">
            {(['All', 'Want to Read', 'Reading', 'Read'] as const).map((status) => (
              <button
                key={status}
                className={`py-2 px-1 border-b-2 transition-colors ${
                  activeTab === status
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredLogs.map((log) => (
            <BookCard 
              key={log.id} 
              book={{ ...log.book!, readingLog: log }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/50 rounded-lg">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-serif mb-2">Your library is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start building your personal library by adding books you want to read, are currently reading, or have finished.
          </p>
          <Link to="/search">
            <Button variant="outline" className="mr-4">
              Search Books
            </Button>
          </Link>
          <Link to="/add-book">
            <Button>Add a Book</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
