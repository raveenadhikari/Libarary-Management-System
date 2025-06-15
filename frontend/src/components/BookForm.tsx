import { useEffect, useState } from "react";
import API from "../services/api";
import { Book } from "../types/Book";
import "./modal.css";

interface Props {
  onBookAdded: () => void;
  bookToEdit?: Book | null;
  onUpdateBook?: (book: Book) => void;
  onClose: () => void;
}

function BookForm({ onBookAdded, bookToEdit, onUpdateBook, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setDescription(bookToEdit.description);
    } else {
      setTitle("");
      setAuthor("");
      setDescription("");
    }
  }, [bookToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (bookToEdit && bookToEdit.id && onUpdateBook) {
        onUpdateBook({ id: bookToEdit.id, title, author, description });
      } else {
        await API.post("/books", { title, author, description });
        onBookAdded();
        setTitle("");
        setAuthor("");
        setDescription("");
      }
    } catch (error) {
      alert("Failed to save book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {bookToEdit ? "📝 Edit Book" : "➕ Add New Book"}
          </h2>
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter book title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter book description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                bookToEdit ? "Updating..." : "Adding..."
              ) : (
                bookToEdit ? "Update Book" : "Add Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;