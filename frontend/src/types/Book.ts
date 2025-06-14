export interface Book {
  id?: number; // optional to support both "add" and "edit"
  title: string;
  author: string;
  description: string;
}
