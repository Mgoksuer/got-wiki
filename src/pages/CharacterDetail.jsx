import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacter, getResourceByUrl, extractId } from '../services/api';
import { getCharacterImage, getCharacterDescription, getInitials } from '../services/images';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function CharacterDetail() {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [allegiances, setAllegiances] = useState([]);
  const [books, setBooks] = useState([]);
  const [father, setFather] = useState(null);
  const [mother, setMother] = useState(null);
  const [spouse, setSpouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setFather(null);
    setMother(null);
    setSpouse(null);

    getCharacter(id)
      .then(async (data) => {
        setCharacter(data);

        if (data.father) getResourceByUrl(data.father).then(setFather).catch(() => {});
        if (data.mother) getResourceByUrl(data.mother).then(setMother).catch(() => {});
        if (data.spouse) getResourceByUrl(data.spouse).then(setSpouse).catch(() => {});

        const housePromises = data.allegiances.slice(0, 5).map((url) =>
          getResourceByUrl(url).catch(() => null)
        );
        setAllegiances((await Promise.all(housePromises)).filter(Boolean));

        const bookPromises = data.books.slice(0, 5).map((url) =>
          getResourceByUrl(url).catch(() => null)
        );
        setBooks((await Promise.all(bookPromises)).filter(Boolean));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!character) return <ErrorMessage message="Character not found" />;

  const name = character.name || character.aliases?.[0] || 'Unknown Character';
  const image = getCharacterImage(name);
  const description = getCharacterDescription(name);
  const titles = character.titles?.filter(Boolean) || [];
  const aliases = character.aliases?.filter(Boolean) || [];
  const tvSeries = character.tvSeries?.filter(Boolean) || [];
  const playedBy = character.playedBy?.filter(Boolean) || [];

  const cardCls = darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200';
  const labelCls = `font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`;
  const valCls = `text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative py-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-got.jpg')" }} />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative max-w-5xl mx-auto animate-fadeIn">
          <Link to="/characters" className="text-got-gold hover:text-got-gold-light font-cinzel text-xs tracking-widest uppercase mb-4 inline-block">
            ← Back to Characters
          </Link>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white tracking-wider uppercase">{name}</h1>
          {aliases.length > 0 && (
            <p className="text-got-gold/70 font-crimson italic text-lg mt-1">
              &ldquo;{aliases[0]}&rdquo;
            </p>
          )}
          {/* Character description in hero */}
          {description && (
            <p className="text-gray-300 font-crimson text-sm mt-3 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          {/* Left: About Card */}
          <div className={`md:w-72 flex-shrink-0 rounded-lg border p-6 ${cardCls}`}>
            {image && (
              <div className="mb-4 rounded overflow-hidden animate-fadeInScale">
                <img src={image} alt={name} className="w-full h-48 object-cover" />
              </div>
            )}
            {!image && (
              <div className={`mb-4 h-32 rounded flex items-center justify-center ${
                darkMode ? 'bg-got-card-light' : 'bg-gray-100'
              }`}>
                <span className={`font-cinzel text-4xl font-bold ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
                  {getInitials(name)}
                </span>
              </div>
            )}

            <h2 className={`font-cinzel text-sm font-bold tracking-wider mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>About</h2>
            <div className={`w-10 h-0.5 mb-4 ${darkMode ? 'bg-got-border' : 'bg-gray-200'}`} />

            <div className="space-y-3">
              {character.gender && (
                <div><p className={labelCls}>Gender</p><p className={valCls}>{character.gender}</p></div>
              )}
              {character.culture && (
                <div><p className={labelCls}>Culture</p><p className={valCls}>{character.culture}</p></div>
              )}
              {character.born && (
                <div><p className={labelCls}>Born</p><p className={`${valCls} italic`}>{character.born}</p></div>
              )}
              {character.died && (
                <div><p className={labelCls}>Died</p><p className="text-sm text-red-400 italic">{character.died}</p></div>
              )}
              {playedBy.length > 0 && (
                <div><p className={labelCls}>Played By</p><p className={valCls}>{playedBy.join(', ')}</p></div>
              )}
              {tvSeries.length > 0 && (
                <div><p className={labelCls}>TV Series</p><p className={valCls}>{tvSeries.join(', ')}</p></div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-6">
            {titles.length > 0 && (
              <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <h3 className={`${labelCls} text-xs mb-3`}>Titles</h3>
                <div className={`rounded-lg border p-4 ${cardCls}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {titles.map((t, i) => (
                      <p key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="text-got-gold mr-2">•</span>{t}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {aliases.length > 0 && (
              <div className="animate-fadeIn" style={{ animationDelay: '250ms' }}>
                <h3 className={`${labelCls} text-xs mb-3`}>Aliases</h3>
                <div className={`rounded-lg border p-4 ${cardCls}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aliases.map((a, i) => (
                      <p key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="text-got-gold mr-2">•</span>{a}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(father || mother || spouse || allegiances.length > 0) && (
              <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <h3 className={`${labelCls} text-xs mb-3`}>Lineage &amp; Bonds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {father && (
                    <div className={`rounded-lg border p-4 ${cardCls}`}>
                      <p className={labelCls}>Father</p>
                      <Link to={`/characters/${extractId(father.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {father.name || father.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                  {mother && (
                    <div className={`rounded-lg border p-4 ${cardCls}`}>
                      <p className={labelCls}>Mother</p>
                      <Link to={`/characters/${extractId(mother.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {mother.name || mother.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                  {spouse && (
                    <div className={`rounded-lg border p-4 ${cardCls}`}>
                      <p className={labelCls}>Spouse</p>
                      <Link to={`/characters/${extractId(spouse.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {spouse.name || spouse.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                  {allegiances.length > 0 && (
                    <div className={`rounded-lg border p-4 ${cardCls}`}>
                      <p className={labelCls}>Allegiances</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {allegiances.map((h) => (
                          <Link key={extractId(h.url)} to={`/houses/${extractId(h.url)}`}
                            className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                            {h.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {books.length > 0 && (
              <div className="animate-fadeIn" style={{ animationDelay: '350ms' }}>
                <h3 className={`${labelCls} text-xs mb-3`}>Appears In</h3>
                <div className={`rounded-lg border p-4 ${cardCls}`}>
                  <div className="flex flex-wrap gap-2">
                    {books.map((b) => (
                      <Link key={extractId(b.url)} to={`/books/${extractId(b.url)}`}
                        className={`px-3 py-1 rounded text-xs font-cinzel transition-colors ${
                          darkMode
                            ? 'bg-got-card-light border border-got-border text-gray-300 hover:text-got-gold'
                            : 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-got-gold-dark'
                        }`}>
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetail;
