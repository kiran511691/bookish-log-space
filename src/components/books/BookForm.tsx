
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Book } from '@/utils/types';
import { addBook } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.string().optional(),
  cover_image_url: z.string().url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
  publication_year: z.coerce.number().min(1000).max(new Date().getFullYear()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  initialData?: Book;
  onSuccess?: (book: Book) => void;
}

const BookForm = ({ initialData, onSuccess }: BookFormProps) => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      author: '',
      genre: '',
      cover_image_url: '',
      publication_year: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Filter out empty strings for optional fields
      const bookData = {
        ...values,
        genre: values.genre || undefined,
        cover_image_url: values.cover_image_url || undefined,
        publication_year: values.publication_year || undefined,
      };

      const newBook = await addBook(bookData);
      toast({
        title: "Book added successfully",
        description: `"${newBook.title}" has been added to the library`,
      });

      if (onSuccess) {
        onSuccess(newBook);
      } else {
        // Navigate to book detail page
        navigate(`/book/${newBook.id}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        variant: "destructive",
        title: "Failed to add book",
        description: "An error occurred while saving the book.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter the author's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Fiction, Science, History" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publication_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Year (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 2023" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {initialData ? 'Update Book' : 'Add Book'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
