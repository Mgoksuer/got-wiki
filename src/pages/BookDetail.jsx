import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook, getResourceByUrl, extractId } from '../services/api';
import { getCharacterImage, getInitials } from '../services/images';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function BookDetail() {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBook(id)
      .then(async (data) => {
        setBook(data);
        const charPromises = data.characters.slice(0, 20).map((url) =>
          getResourceByUrl(url).catch(() => null)
        );
        const chars = await Promise.all(charPromises);
        setCharacters(chars.filter(Boolean));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link to="/books" className="text-got-gold hover:text-got-gold-light font-cinzel text-sm tracking-wider mb-6 inline-block">
          ← Back to Books
        </Link>

        <div className={`rounded-lg overflow-hidden border ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className={`h-3 ${darkMode ? 'bg-got-gold/30' : 'bg-got-gold/50'}`}></div>
          <div className="p-6 md:p-8">
            <h1 className={`font-cinzel text-2xl md:text-3xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>{book.name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <InfoItem label="Authors" value={book.authors.join(', ')} darkMode={darkMode} />
              <InfoItem label="ISBN" value={book.isbn} darkMode={darkMode} />
              <InfoItem label="Publisher" value={book.publisher} darkMode={darkMode} />
              <InfoItem label="Country" value={book.country} darkMode={darkMode} />
              <InfoItem label="Media Type" value={book.mediaType} darkMode={darkMode} />
              <InfoItem label="Pages" value={book.numberOfPages} darkMode={darkMode} />
              <InfoItem label="Released" value={new Date(book.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} darkMode={darkMode} />
            </div>

            {characters.length > 0 && (
              <div>
                <h2 className={`font-cinzel text-lg tracking-wider mb-4 ${
                  darkMode ? 'text-got-gold' : 'text-got-gold-dark'
                }`}>
                  Characters ({book.characters.length} total, showing first 20)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {characters.map((char) => {
                    const charId = extractId(char.url);
                    const name = char.name || char.aliases?.[0] || 'Unknown';
                    const image = getCharacterImage(name);
                    return (
                      <Link
                        key={charId}
                        to={`/characters/${charId}`}
                        className={`group block rounded-lg overflow-hidden text-center transition-all border ${
                          darkMode
                            ? 'bg-got-card-light border-got-border hover:border-got-gold/50'
                            : 'bg-gray-50 border-gray-200 hover:border-got-gold'
                        }`}
                      >
                        <div className={`h-20 flex items-center justify-center overflow-hidden ${
                          darkMode ? 'bg-got-darker' : 'bg-gray-100'
                        }`}>
                          {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-cinzel text-xs font-bold ${
                              darkMode ? 'bg-got-border text-got-gold' : 'bg-gray-200 text-got-gold-dark'
                            }`}>
                              {getInitials(name)}
                            </div>
                          )}
                        </div>
                        <p className={`py-2 px-1 text-xs font-cinzel tracking-wide truncate group-hover:text-got-gold transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {name}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, darkMode }) {
  if (!value) return null;
  return (
    <div>
      <span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </span>
      <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value}</p>
    </div>
  );
}

export default BookDetail;
