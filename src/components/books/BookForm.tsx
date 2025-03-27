
import React, { useState } from 'react';
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
import { Upload, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '../ui/card';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.string().optional(),
  publication_year: z.coerce.number().min(1000).max(new Date().getFullYear()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  initialData?: Book;
  onSuccess?: (book: Book) => void;
}

const BookForm = ({ initialData, onSuccess }: BookFormProps) => {
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.cover_image_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      author: '',
      genre: '',
      publication_year: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  const clearCoverImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    try {
      // Create a unique filename with timestamp and original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setIsUploading(true);
      
      const { data, error } = await supabase.storage
        .from('book_covers')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('book_covers')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An error occurred while uploading the cover image.",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true);
      // If there's a new cover file, upload it
      let coverImageUrl = coverPreview;
      
      if (coverFile) {
        coverImageUrl = await uploadCoverImage(coverFile);
        if (!coverImageUrl) return; // Exit if upload failed
      }

      // Filter out empty strings for optional fields but ensure title and author are included
      const bookData = {
        title: values.title,
        author: values.author,
        genre: values.genre || undefined,
        cover_image_url: coverImageUrl || undefined,
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
    } finally {
      setIsUploading(false);
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

        <div>
          <FormLabel>Cover Image (Optional)</FormLabel>
          <div className="mt-1 space-y-4">
            {coverPreview ? (
              <div className="relative w-40">
                <Card className="overflow-hidden">
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full h-auto object-cover"
                  />
                </Card>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-background rounded-full"
                  onClick={clearCoverImage}
                >
                  <XCircle className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <div className="mt-2">
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>Upload a file</span>
                    <input
                      id="cover-upload"
                      name="cover"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : initialData ? 'Update Book' : 'Add Book'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
