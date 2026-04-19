import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { extractId } from '../services/api';
import { getHouseColors } from '../services/images';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const REGIONS = [
  'The North', 'The Riverlands', 'The Vale', 'The Westerlands',
  'The Reach', 'The Stormlands', 'Dorne', 'Iron Islands', 'The Crownlands',
];

function Houses() {
  const { darkMode } = useTheme();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [hasWordsFilter, setHasWordsFilter] = useState(false);
  const [hasSeatFilter, setHasSeatFilter] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `https://anapioficeandfire.com/api/houses?page=${page}&pageSize=50`;
    if (regionFilter) url += `&region=${encodeURIComponent(regionFilter)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const linkHeader = res.headers.get('Link');
        const links = {};
        if (linkHeader) {
          linkHeader.split(',').forEach((part) => {
            const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
            if (match) links[match[2]] = match[1];
          });
        }
        setHasNext(!!links.next);
        setHasPrev(!!links.prev);
        return res.json();
      })
      .then((data) => setHouses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, regionFilter]);

  const filtered = useMemo(() => {
    let result = [...houses];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((h) => h.name.toLowerCase().includes(q));
    }
    if (hasWordsFilter) {
      result = result.filter((h) => h.words);
    }
    if (hasSeatFilter) {
      result = result.filter((h) => h.seats && h.seats.some(Boolean));
    }

    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [houses, searchQuery, hasWordsFilter, hasSeatFilter]);

  const cardBg = darkMode
    ? 'bg-got-card border-got-border hover:border-got-gold/50 hover:shadow-[0_0_20px_rgba(184,134,11,0.12)]'
    : 'bg-white border-gray-200 hover:border-got-gold hover:shadow-lg';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative py-10 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/house.jpg')" }} />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
        <div className="relative animate-fadeIn">
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider">Noble Houses</h1>
          <p className="text-gray-400 font-crimson">The great families of the Seven Kingdoms</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Filters */}
        <div className={`rounded-lg p-4 mb-6 border animate-slideDown ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search house by name..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors font-crimson ${
                  darkMode
                    ? 'bg-got-darker border-got-border text-gray-200 placeholder-gray-500 focus:border-got-gold'
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-got-gold'
                } focus:outline-none focus:ring-1 focus:ring-got-gold`}
              />
            </div>

            <select value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg border font-crimson text-sm cursor-pointer ${
                darkMode ? 'bg-got-darker border-got-border text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-700'
              } focus:outline-none focus:ring-1 focus:ring-got-gold`}>
              <option value="">All Regions</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <label className={`flex items-center gap-2 text-sm cursor-pointer ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <input type="checkbox" checked={hasWordsFilter} onChange={(e) => setHasWordsFilter(e.target.checked)}
                className="accent-got-gold cursor-pointer" />
              Has Words
            </label>

            <label className={`flex items-center gap-2 text-sm cursor-pointer ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <input type="checkbox" checked={hasSeatFilter} onChange={(e) => setHasSeatFilter(e.target.checked)}
                className="accent-got-gold cursor-pointer" />
              Has Seat
            </label>
          </div>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            <p className={`text-xs mb-4 font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Showing {filtered.length} houses (Page {page})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((house, idx) => {
                const id = extractId(house.url);
                const colors = getHouseColors(house.name);
                const topBorderStyle = colors
                  ? { borderTop: `3px solid ${colors.primary}` }
                  : {};

                return (
                  <Link key={id} to={`/houses/${id}`}
                    className={`group block rounded-lg overflow-hidden transition-all duration-300 border card-hover-lift ${cardBg}`}
                    style={topBorderStyle}>
                    <div className="p-5">
                      {/* House name with color accent */}
                      <div className="flex items-start gap-3">
                        {colors && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                            <span className="text-white text-xs font-cinzel font-bold">
                              {house.name.replace('House ', '').charAt(0)}
                            </span>
                          </div>
                        )}
                        <h2 className={`font-cinzel text-sm font-semibold mb-2 tracking-wide group-hover:text-got-gold transition-colors ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>{house.name}</h2>
                      </div>

                      {house.words && (
                        <p className={`italic text-sm mb-3 font-crimson ${darkMode ? 'text-got-gold/70' : 'text-got-gold-dark'}`}>
                          &ldquo;{house.words}&rdquo;
                        </p>
                      )}

                      <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {house.region && <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Region:</span> {house.region}</p>}
                        {house.coatOfArms && (
                          <p className="line-clamp-2"><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Sigil:</span> {house.coatOfArms}</p>
                        )}
                        {house.seats && house.seats.filter(Boolean).length > 0 && (
                          <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Seat:</span> {house.seats.filter(Boolean).join(', ')}</p>
                        )}
                        {house.swornMembers && house.swornMembers.length > 0 && (
                          <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Members:</span> {house.swornMembers.length}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <p className={`text-center py-10 font-cinzel ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No houses match your filters.
              </p>
            )}

            <Pagination page={page} hasNext={hasNext} hasPrev={hasPrev} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

export default Houses;
