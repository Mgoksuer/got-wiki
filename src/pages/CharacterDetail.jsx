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
  const isAlive = !character.died;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero — full width with image or gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-got.jpg')" }} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-black/80 via-[#0d1117]/90 to-[#0d1117]' : 'bg-gradient-to-b from-black/70 via-gray-900/80 to-gray-50'}`} />

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-28">
          <Link to="/characters" className="text-got-gold/80 hover:text-got-gold font-cinzel text-xs tracking-widest uppercase mb-6 inline-flex items-center gap-2 transition-colors">
            <span>&#8592;</span> Back to Characters
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6 mt-2">
            {/* Avatar / Image */}
            <div className="flex-shrink-0">
              {image ? (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-2 border-got-gold/30 shadow-[0_0_30px_rgba(184,134,11,0.15)]">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-xl flex items-center justify-center border-2 border-got-gold/20 ${
                  darkMode ? 'bg-gradient-to-br from-got-card via-got-darker to-got-card' : 'bg-gradient-to-br from-gray-200 to-gray-300'
                }`}>
                  <span className="font-cinzel text-5xl font-bold text-got-gold/60">{getInitials(name)}</span>
                </div>
              )}
            </div>

            {/* Name & Meta */}
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white tracking-wider">{name}</h1>
                <span className={`text-[10px] font-cinzel tracking-wider px-2.5 py-1 rounded-full border ${
                  isAlive
                    ? 'bg-green-900/30 text-green-400 border-green-700/40'
                    : 'bg-red-900/30 text-red-400 border-red-700/40'
                }`}>{isAlive ? 'ALIVE' : 'DECEASED'}</span>
              </div>

              {aliases.length > 0 && (
                <p className="text-got-gold/60 font-crimson italic text-lg">&ldquo;{aliases[0]}&rdquo;</p>
              )}

              {description && (
                <p className="text-gray-400 font-crimson text-sm mt-3 max-w-2xl leading-relaxed">{description}</p>
              )}

              {/* Quick stats inline */}
              <div className="flex flex-wrap gap-4 mt-4">
                {character.gender && <QuickStat label="Gender" value={character.gender} />}
                {character.culture && <QuickStat label="Culture" value={character.culture} />}
                {playedBy.length > 0 && <QuickStat label="Played by" value={playedBy[0]} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content — overlapping cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn" style={{ animationDelay: '150ms' }}>

          {/* Left column: Bio card */}
          <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
            <h2 className={`${labelCls} text-xs mb-4`}>Biography</h2>
            <div className={`w-10 h-px mb-4 ${darkMode ? 'bg-got-gold/30' : 'bg-gray-200'}`} />
            <div className="space-y-3">
              {character.born && (
                <div><p className={labelCls}>Born</p><p className={`${valCls} italic`}>{character.born}</p></div>
              )}
              {character.died && (
                <div><p className={labelCls}>Died</p><p className="text-sm text-red-400 italic">{character.died}</p></div>
              )}
              {tvSeries.length > 0 && (
                <div><p className={labelCls}>TV Seasons</p><p className={valCls}>{tvSeries.join(', ')}</p></div>
              )}
            </div>

            {/* Lineage in bio card */}
            {(father || mother || spouse) && (
              <>
                <div className={`w-full h-px my-4 ${darkMode ? 'bg-got-border' : 'bg-gray-200'}`} />
                <h3 className={`${labelCls} text-xs mb-3`}>Lineage</h3>
                <div className="space-y-2">
                  {father && (
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Father</span>
                      <Link to={`/characters/${extractId(father.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {father.name || father.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                  {mother && (
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Mother</span>
                      <Link to={`/characters/${extractId(mother.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {mother.name || mother.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                  {spouse && (
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Spouse</span>
                      <Link to={`/characters/${extractId(spouse.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold">
                        {spouse.name || spouse.aliases?.[0] || 'Unknown'}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Allegiances */}
            {allegiances.length > 0 && (
              <>
                <div className={`w-full h-px my-4 ${darkMode ? 'bg-got-border' : 'bg-gray-200'}`} />
                <h3 className={`${labelCls} text-xs mb-3`}>Allegiances</h3>
                <div className="space-y-1">
                  {allegiances.map((h) => (
                    <Link key={extractId(h.url)} to={`/houses/${extractId(h.url)}`}
                      className={`block text-sm py-1.5 px-3 rounded transition-colors ${
                        darkMode ? 'bg-got-card-light hover:bg-got-border text-gray-300 hover:text-got-gold' : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-got-gold-dark'
                      }`}>
                      {h.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right column: Titles, Aliases, Books */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Top row: Titles & Aliases side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {titles.length > 0 && (
                <div className={`rounded-xl border p-5 ${cardCls} shadow-lg h-fit`}>
                  <h3 className={`${labelCls} text-xs mb-3`}>Titles</h3>
                  <div className="flex flex-col gap-2">
                    {titles.map((t, i) => (
                      <div key={i} className={`flex items-start gap-2 py-1.5 px-3 rounded text-sm ${
                        darkMode ? 'bg-got-card-light text-gray-300' : 'bg-gray-50 text-gray-600'
                      }`}>
                        <span className="text-got-gold mt-0.5 text-xs">&#9670;</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aliases.length > 0 && (
                <div className={`rounded-xl border p-5 ${cardCls} shadow-lg h-fit`}>
                  <h3 className={`${labelCls} text-xs mb-3`}>Also Known As</h3>
                  <div className="flex flex-wrap gap-2">
                    {aliases.map((a, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-crimson italic ${
                        darkMode ? 'bg-got-card-light border border-got-border text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'
                      }`}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom row: Books */}
            {books.length > 0 && (
              <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
                <h3 className={`${labelCls} text-xs mb-3`}>Appears In</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {books.map((b) => (
                    <Link key={extractId(b.url)} to={`/books/${extractId(b.url)}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-cinzel tracking-wide transition-all ${
                        darkMode
                          ? 'bg-got-card-light border border-got-border text-gray-300 hover:text-got-gold hover:border-got-gold/40'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-got-gold-dark hover:border-got-gold/40'
                      }`}>
                      <span className="text-got-gold/50 text-lg">&#9733;</span>
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-cinzel tracking-wider text-gray-500 uppercase">{label}:</span>
      <span className="text-sm text-gray-300">{value}</span>
    </div>
  );
}

export default CharacterDetail;
