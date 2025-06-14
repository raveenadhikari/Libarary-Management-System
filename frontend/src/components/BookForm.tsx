import { useEffect, useState } from "react";
import API from "../services/api";
import { Book } from "../types/Book";


interface Props {
  onBookAdded: () => void;
  bookToEdit?: Book | null;
  onUpdateBook?: (book: Book) => void;
}

function BookForm({ onBookAdded, bookToEdit, onUpdateBook }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setDescription(bookToEdit.description);
    }
  }, [bookToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bookToEdit && bookToEdit.id && onUpdateBook) {
      onUpdateBook({ id: bookToEdit.id, title, author, description });
    } else {
      await API.post("/books", { title, author, description });
      onBookAdded();
      setTitle("");
      setAuthor("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{bookToEdit ? "Edit Book" : "Add Book"}</h3>
      <input className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input className="form-control mt-2" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      <textarea className="form-control mt-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <button className="btn btn-primary mt-3" type="submit">{bookToEdit ? "Update" : "Add"}</button>
    </form>
  );
}

export default BookForm;
