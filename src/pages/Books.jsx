import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, extractId } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

function Books() {
  const { darkMode } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBooks(page, 12)
      .then((result) => {
        setBooks(result.data);
        setHasNext(result.hasNext);
        setHasPrev(result.hasPrev);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      <div className="relative py-10 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/book.jpg')" }} />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
        <div className="relative animate-fadeIn">
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider">The Books</h1>
          <p className="text-gray-400 font-crimson">The chronicles of A Song of Ice and Fire</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const id = extractId(book.url);
            return (
              <Link key={id} to={`/books/${id}`}
                className={`group block rounded-lg overflow-hidden transition-all border card-hover-lift ${
                  darkMode
                    ? 'bg-got-card border-got-border hover:border-got-gold/50 hover:shadow-[0_0_20px_rgba(184,134,11,0.12)]'
                    : 'bg-white border-gray-200 hover:border-got-gold hover:shadow-lg'
                }`}>
                <div className={`h-2 bg-gradient-to-r ${darkMode ? 'from-got-gold/40 to-got-gold/10' : 'from-got-gold/60 to-got-gold/20'}`} />
                <div className="p-5">
                  <h2 className={`font-cinzel text-base font-semibold mb-3 tracking-wide group-hover:text-got-gold transition-colors ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{book.name}</h2>
                  <div className={`text-sm space-y-2 font-crimson ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p><span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Author: </span>{book.authors.join(', ')}</p>
                    <p><span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Released: </span>{new Date(book.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pages: </span>{book.numberOfPages}</p>
                    <p><span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Characters: </span>{book.characters.length}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {books.length === 0 && (
          <p className={`text-center py-10 font-cinzel ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No books found.</p>
        )}

        <Pagination page={page} hasNext={hasNext} hasPrev={hasPrev} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default Books;
