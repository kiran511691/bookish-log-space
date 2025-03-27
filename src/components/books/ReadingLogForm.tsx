
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ReadingLog, ReadingStatus } from '@/utils/types';
import { addToReadingLog, updateReadingLog } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  status: z.enum(['Want to Read', 'Reading', 'Read'] as const),
  rating: z.coerce.number().min(1).max(5).optional(),
  start_date: z.string().optional(),
  finish_date: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReadingLogFormProps {
  bookId: string;
  existingLog?: ReadingLog;
  onSuccess?: (log: ReadingLog) => void;
}

const ReadingLogForm = ({ bookId, existingLog, onSuccess }: ReadingLogFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingLog ? {
      status: existingLog.status,
      rating: existingLog.rating,
      start_date: existingLog.start_date,
      finish_date: existingLog.finish_date,
      notes: existingLog.notes || '',
    } : {
      status: 'Want to Read',
      rating: undefined,
      start_date: '',
      finish_date: '',
      notes: '',
    },
  });

  const status = form.watch('status');

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const logData = {
        status: values.status, // Explicitly include status to ensure it's not optional
        user_id: user.id,
        book_id: bookId,
        rating: values.rating,
        start_date: values.start_date || undefined,
        finish_date: values.finish_date || undefined,
        notes: values.notes || undefined,
      };
      
      let result;
      
      if (existingLog) {
        result = await updateReadingLog(existingLog.id, logData);
        toast({
          title: "Reading log updated",
          description: "Your reading progress has been updated",
        });
      } else {
        result = await addToReadingLog(logData);
        toast({
          title: "Added to your library",
          description: `Book added to your "${values.status}" list`,
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error saving reading log:', error);
      toast({
        variant: "destructive",
        title: "Error saving reading log",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Reading Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Want to Read" />
                    </FormControl>
                    <FormLabel className="font-normal">Want to Read</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Reading" />
                    </FormControl>
                    <FormLabel className="font-normal">Currently Reading</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Read" />
                    </FormControl>
                    <FormLabel className="font-normal">Finished Reading</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(status === 'Reading' || status === 'Read') && (
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {status === 'Read' && (
          <>
            <FormField
              control={form.control}
              name="finish_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finish Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5)</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          variant={field.value === rating ? "default" : "outline"}
                          className="w-10 h-10 p-0"
                          onClick={() => field.onChange(rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add your thoughts, favorite quotes, or notes about this book..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span>{existingLog ? 'Update Reading Status' : 'Add to My Library'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReadingLogForm;
