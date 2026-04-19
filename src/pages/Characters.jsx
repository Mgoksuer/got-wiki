import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCharacters, extractId, getResourceByUrl } from '../services/api';
import { getCharacterImage, getCharacterDescription, getInitials } from '../services/images';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

function Characters() {
  const { darkMode } = useTheme();
  const [characters, setCharacters] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [cultureFilter, setCultureFilter] = useState('');
  const [aliveFilter, setAliveFilter] = useState('');
  const [parentNames, setParentNames] = useState({});
  const parentCacheRef = useRef({});

  // Resolve father/mother names from URLs — uses ref to avoid circular deps
  const resolveParentNames = useCallback(async (chars) => {
    const urls = new Set();
    chars.forEach((c) => {
      if (c.father) urls.add(c.father);
      if (c.mother) urls.add(c.mother);
    });

    const cache = parentCacheRef.current;
    const toFetch = [...urls].filter((url) => !cache[url]);
    if (toFetch.length === 0) return;

    const promises = toFetch.map(async (url) => {
      try {
        const data = await getResourceByUrl(url);
        cache[url] = data.name || data.aliases?.[0] || 'Unknown';
      } catch {
        cache[url] = 'Unknown';
      }
    });

    await Promise.all(promises);
    parentCacheRef.current = cache;
    setParentNames({ ...cache });
  }, []);

  useEffect(() => {
    if (searchResults) return;
    setLoading(true);
    setError(null);
    getCharacters(page, 50)
      .then((result) => {
        setCharacters(result.data);
        setHasNext(result.hasNext);
        setHasPrev(result.hasPrev);
        resolveParentNames(result.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, searchResults, resolveParentNames]);

  const doSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    setError(null);

    const fetchPages = [];
    for (let p = 1; p <= 5; p++) {
      fetchPages.push(
        fetch(`https://anapioficeandfire.com/api/characters?pageSize=50&page=${p}`)
          .then((r) => r.json())
          .catch(() => [])
      );
    }

    Promise.all(fetchPages).then((pages) => {
      const all = pages.flat();
      const q = query.toLowerCase();
      const matches = all.filter((c) => {
        const name = (c.name || '').toLowerCase();
        const aliases = (c.aliases || []).join(' ').toLowerCase();
        return name.includes(q) || aliases.includes(q);
      });
      matches.sort((a, b) => {
        const nameA = a.name || a.aliases?.[0] || '';
        const nameB = b.name || b.aliases?.[0] || '';
        return nameA.localeCompare(nameB);
      });
      setSearchResults(matches);
      setSearching(false);
      resolveParentNames(matches);
    });
  }, [resolveParentNames]);

  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, doSearch]);

  const cultures = useMemo(() => {
    const source = searchResults || characters;
    const set = new Set();
    source.forEach((c) => { if (c.culture) set.add(c.culture); });
    return [...set].sort();
  }, [characters, searchResults]);

  const displayChars = useMemo(() => {
    let result = searchResults ? [...searchResults] : [...characters];

    if (genderFilter) result = result.filter((c) => c.gender === genderFilter);
    if (cultureFilter) result = result.filter((c) => c.culture === cultureFilter);
    if (aliveFilter === 'alive') result = result.filter((c) => !c.died);
    else if (aliveFilter === 'dead') result = result.filter((c) => c.died);

    if (!searchResults) {
      result.sort((a, b) => {
        const nameA = a.name || a.aliases?.[0] || '';
        const nameB = b.name || b.aliases?.[0] || '';
        return nameA.localeCompare(nameB);
      });
    }

    return result;
  }, [characters, searchResults, genderFilter, cultureFilter, aliveFilter]);

  const isLoading = loading || searching;

  const cardCls = darkMode
    ? 'bg-got-card border-got-border hover:border-got-gold/50'
    : 'bg-white border-gray-200 hover:border-got-gold hover:shadow-lg';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero banner */}
      <div className="relative py-10 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-got.jpg')" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fadeIn">
          <div>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-1 tracking-wider">
              Characters
            </h1>
            <p className="text-gray-400 font-crimson text-sm">
              Explore the heroes, villains, and everyone in between from the Seven Kingdoms.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all characters..."
              className={`w-full pl-4 pr-10 py-2.5 rounded-lg border font-crimson text-sm ${
                darkMode
                  ? 'bg-got-card border-got-border text-gray-200 placeholder-gray-500 focus:border-got-gold'
                  : 'bg-white/90 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-got-gold'
              } focus:outline-none focus:ring-1 focus:ring-got-gold`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Filters */}
        <div className={`rounded-lg p-3 mb-6 border flex flex-wrap items-center gap-3 animate-slideDown ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200'
        }`}>
          <span className={`font-cinzel text-xs tracking-widest font-bold ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
            Filters
          </span>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border font-crimson text-sm cursor-pointer flex-1 min-w-[140px] ${
              darkMode ? 'bg-got-darker border-got-border text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-1 focus:ring-got-gold`}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select value={cultureFilter} onChange={(e) => setCultureFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border font-crimson text-sm cursor-pointer flex-1 min-w-[140px] ${
              darkMode ? 'bg-got-darker border-got-border text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-1 focus:ring-got-gold`}>
            <option value="">All Cultures</option>
            {cultures.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={aliveFilter} onChange={(e) => setAliveFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border font-crimson text-sm cursor-pointer flex-1 min-w-[140px] ${
              darkMode ? 'bg-got-darker border-got-border text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-1 focus:ring-got-gold`}>
            <option value="">All Status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
          </select>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && (
          <>
            <p className={`text-sm mb-4 font-cinzel tracking-wider ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
              {searchResults ? `Search Results (${displayChars.length})` : `Showing ${displayChars.length} characters — Page ${page}`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayChars.map((char, idx) => {
                const id = extractId(char.url);
                const name = char.name || char.aliases?.[0] || 'Unknown';
                const image = getCharacterImage(name);
                const description = getCharacterDescription(name);
                const alias = char.aliases?.filter(Boolean)?.[0];
                const fatherName = char.father ? parentNames[char.father] : null;
                const motherName = char.mother ? parentNames[char.mother] : null;

                return (
                  <Link key={id} to={`/characters/${id}`}
                    className={`group block rounded-lg overflow-hidden transition-all duration-300 border card-hover-lift ${cardCls}`}>

                    {image ? (
                      <div className="h-40 overflow-hidden relative">
                        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {char.died && (
                          <span className="absolute top-2 right-2 bg-red-900/80 text-red-200 text-[10px] px-2 py-0.5 rounded font-cinzel tracking-wider">
                            DECEASED
                          </span>
                        )}
                      </div>
                    ) : null}

                    <div className="p-4">
                      <h2 className={`font-cinzel text-sm font-bold tracking-wide group-hover:text-got-gold transition-colors ${
                        darkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}>{name}</h2>

                      {/* Character description */}
                      {description && (
                        <p className={`text-xs mt-1.5 line-clamp-2 font-crimson italic ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{description}</p>
                      )}

                      <div className={`text-xs mt-2 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {char.gender && char.gender !== 'Unknown' && (
                          <p>Gender: {char.gender}</p>
                        )}
                        {char.culture && <p>Culture: {char.culture}</p>}

                        {/* Resolved parent names */}
                        {(fatherName || motherName) && (
                          <div className="mt-2">
                            <p className={`font-cinzel text-[10px] tracking-widest font-bold mb-0.5 ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
                              Lineage
                            </p>
                            {fatherName && (
                              <p>Father: <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{fatherName}</span></p>
                            )}
                            {motherName && (
                              <p>Mother: <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{motherName}</span></p>
                            )}
                          </div>
                        )}

                        {char.born && (
                          <div className="mt-2">
                            <p className={`font-cinzel text-[10px] tracking-widest font-bold mb-0.5 ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
                              Born
                            </p>
                            <p className="italic">{char.born}</p>
                          </div>
                        )}
                      </div>

                      {alias && (
                        <p className="text-got-gold/70 text-xs italic mt-3 font-crimson">
                          ~ {alias}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {displayChars.length === 0 && (
              <p className={`text-center py-10 font-cinzel ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No characters match your search.
              </p>
            )}

            {!searchResults && (
              <Pagination page={page} hasNext={hasNext} hasPrev={hasPrev} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Characters;
