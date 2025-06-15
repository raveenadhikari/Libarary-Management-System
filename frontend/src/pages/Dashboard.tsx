import { useEffect, useState } from "react";
import API from "../services/api";
import BookForm from "../components/BookForm";
import { useNavigate } from "react-router-dom";
import { Book } from "../types/Book";
import "./dashboard.css";

function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch {
      setError("Failed to fetch books.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await API.delete(`/books/${id}`);
        fetchBooks();
      } catch {
        alert("Failed to delete book.");
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditBook(book);
    setShowModal(true);
  };

  const handleUpdate = async (book: Book) => {
    try {
      await API.put(`/books/${book.id}`, book);
      setEditBook(null);
      setShowModal(false);
      fetchBooks();
    } catch {
      alert("Failed to update book.");
    }
  };

  const handleAddBook = () => {
    setEditBook(null);
    setShowModal(true);
  };

  const handleBookAdded = () => {
    setShowModal(false);
    fetchBooks();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditBook(null);
  };

  const handleSearch = () => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredBooks([]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else fetchBooks();
  }, [navigate]);

  const displayBooks = filteredBooks.length > 0 || searchTerm ? filteredBooks : books;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title"> Library Management System</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div className="content-card">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder=" Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          {searchTerm && (
            <button className="search-btn" onClick={clearSearch} style={{background: 'linear-gradient(135deg, #718096, #4a5568)'}}>
              Clear
            </button>
          )}
        </div>

        <button className="add-book-btn" onClick={handleAddBook}>
          +  Add New Book
        </button>

        {error && <div className="error-message">{error}</div>}

        {books.length === 0 ? (
          <div className="no-books">
             No books in your library yet. Add your first book to get started!
          </div>
        ) : displayBooks.length === 0 && searchTerm ? (
          <div className="no-books">
             No books found matching your search criteria.
          </div>
        ) : (
          <div className="books-list">
            {displayBooks.map((book) => (
              <div key={book.id} className="book-row">
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-description">{book.description}</p>
                </div>
                <div className="book-actions">
                  <button className="edit-btn" onClick={() => handleEdit(book)}>
                     Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => book.id !== undefined && handleDelete(book.id)}
                  >
                     Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <BookForm
          onBookAdded={handleBookAdded}
          bookToEdit={editBook}
          onUpdateBook={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Dashboard;