
import React from 'react';
import { ReadingStatus } from '@/utils/types';
import { cn } from '@/lib/utils';

interface ReadingStatusBadgeProps {
  status: ReadingStatus;
  size?: 'sm' | 'md' | 'lg';
}

const ReadingStatusBadge = ({ status, size = 'sm' }: ReadingStatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Want to Read':
        return 'bg-reading-want/15 text-reading-want border-reading-want/30';
      case 'Reading':
        return 'bg-reading-current/15 text-reading-current border-reading-current/30';
      case 'Read':
        return 'bg-reading-completed/15 text-reading-completed border-reading-completed/30';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'px-3 py-1',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        getStatusStyles(),
        sizeClasses[size]
      )}
    >
      {status}
    </span>
  );
};

export default ReadingStatusBadge;
