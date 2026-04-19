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

  const labelCls = `font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`;
  const cardCls = darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/book.jpg')" }} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-black/85 via-[#0d1117]/90 to-[#0d1117]' : 'bg-gradient-to-b from-black/75 via-gray-900/80 to-gray-50'}`} />

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-28">
          <Link to="/books" className="text-got-gold/80 hover:text-got-gold font-cinzel text-xs tracking-widest uppercase mb-6 inline-flex items-center gap-2 transition-colors">
            <span>&#8592;</span> Back to Books
          </Link>

          <div className="animate-fadeIn mt-2 flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
               <div className={`w-28 h-36 md:w-32 md:h-44 rounded-lg flex items-center justify-center border-2 border-got-gold/20 shadow-[0_0_30px_rgba(184,134,11,0.15)] ${
                  darkMode ? 'bg-gradient-to-br from-got-card via-got-darker to-got-card' : 'bg-gradient-to-br from-gray-200 to-gray-300'
                }`}>
                  <span className="font-cinzel text-5xl font-bold text-got-gold/60">&#10022;</span>
               </div>
            </div>
            
            <div className="pt-2 md:pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white tracking-wider">{book.name}</h1>
              </div>

              {book.authors && (
                <p className="text-got-gold font-crimson italic text-xl mt-2">
                  By {book.authors.join(', ')}
                </p>
              )}

              <p className="text-gray-400 font-crimson text-sm mt-4 max-w-xl leading-relaxed">
                The epic fantasy novel '{book.name}' was released on {new Date(book.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. It consists of {book.numberOfPages} pages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content — overlapping cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn" style={{ animationDelay: '150ms' }}>

          {/* Left: Book Info */}
          <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
            <h2 className={`${labelCls} text-xs mb-4`}>Publication Details</h2>
            <div className={`w-10 h-px mb-4 ${darkMode ? 'bg-got-gold/30' : 'bg-gray-200'}`} />

            <div className="space-y-4">
              <InfoItem label="ISBN" value={book.isbn} darkMode={darkMode} />
              <InfoItem label="Publisher" value={book.publisher} darkMode={darkMode} />
              <InfoItem label="Country" value={book.country} darkMode={darkMode} />
              <InfoItem label="Media Type" value={book.mediaType} darkMode={darkMode} />
              <InfoItem label="Pages" value={book.numberOfPages} darkMode={darkMode} />
              <InfoItem label="Released" value={new Date(book.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} darkMode={darkMode} />
            </div>
          </div>

          {/* Right: Characters */}
          <div className="lg:col-span-2">
            {characters.length > 0 && (
              <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${labelCls} text-xs`}>Notable Characters</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-got-card-light text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>Showing {characters.length} of {book.characters.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {characters.map((char) => {
                    const charId = extractId(char.url);
                    const name = char.name || char.aliases?.[0] || 'Unknown';
                    const image = getCharacterImage(name);

                    return (
                      <Link
                        key={charId}
                        to={`/characters/${charId}`}
                        className={`group block rounded-lg overflow-hidden transition-all border card-hover-lift ${
                          darkMode
                            ? 'bg-got-card-light border-got-border hover:border-got-gold/40'
                            : 'bg-gray-50 border-gray-200 hover:border-got-gold/40'
                        }`}
                      >
                        <div className={`h-24 flex items-center justify-center overflow-hidden ${
                          darkMode ? 'bg-got-darker' : 'bg-gray-100'
                        }`}>
                          {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-cinzel text-xs font-bold ${
                              darkMode ? 'bg-got-border text-got-gold' : 'bg-gray-200 text-got-gold-dark'
                            }`}>
                              {getInitials(name)}
                            </div>
                          )}
                        </div>
                        <p className={`py-2.5 px-2 text-xs font-cinzel tracking-wide truncate text-center group-hover:text-got-gold transition-colors ${
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
            
            {characters.length === 0 && (
              <div className={`rounded-xl border p-8 text-center ${cardCls} shadow-lg`}>
                <p className={`font-crimson italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No character data available for this book.
                </p>
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
      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
      }`}>{label}</span>
      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value}</p>
    </div>
  );
}

export default BookDetail;
