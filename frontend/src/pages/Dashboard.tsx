import { useEffect, useState } from "react";
import API from "../services/api";
import BookForm from "../components/BookForm";
import { useNavigate } from "react-router-dom";
import { Book } from "../types/Book";


function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch {
      setError("Failed to fetch books.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch {
      alert("Failed to delete book.");
    }
  };

  const handleEdit = (book: Book) => {
    setEditBook(book);
  };

  const handleUpdate = async (book: Book) => {
    try {
      await API.put(`/books/${book.id}`, book);
      setEditBook(null);
      fetchBooks();
    } catch {
      alert("Failed to update book.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else fetchBooks();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      <BookForm
        onBookAdded={fetchBooks}
        bookToEdit={editBook}
        onUpdateBook={handleUpdate}
      />
      <button
        className="btn btn-secondary btn-sm float-end"
        onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
        }}
        >
        Logout
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul className="list-group">
          {books.map((book) => (
            <li key={book.id} className="list-group-item">
              <strong>{book.title}</strong> by {book.author}<br />
              <em>{book.description}</em>
              <div className="mt-2">
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(book)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => book.id !== undefined && handleDelete(book.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
