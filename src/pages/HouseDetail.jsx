import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHouse, getResourceByUrl, extractId } from '../services/api';
import { getCharacterImage, getInitials } from '../services/images';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function HouseDetail() {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentLord, setCurrentLord] = useState(null);
  const [founder, setFounder] = useState(null);
  const [heir, setHeir] = useState(null);
  const [overlord, setOverlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getHouse(id)
      .then(async (data) => {
        setHouse(data);

        if (data.currentLord) {
          const lord = await getResourceByUrl(data.currentLord).catch(() => null);
          setCurrentLord(lord);
        }
        if (data.founder) {
          const f = await getResourceByUrl(data.founder).catch(() => null);
          setFounder(f);
        }
        if (data.heir) {
          const h = await getResourceByUrl(data.heir).catch(() => null);
          setHeir(h);
        }
        if (data.overlord) {
          const o = await getResourceByUrl(data.overlord).catch(() => null);
          setOverlord(o);
        }

        const memberPromises = data.swornMembers.map((url) =>
          getResourceByUrl(url).catch(() => null)
        );
        const memberData = await Promise.all(memberPromises);
        setMembers(memberData.filter(Boolean));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!house) return <ErrorMessage message="House not found" />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link to="/houses" className="text-got-gold hover:text-got-gold-light font-cinzel text-sm tracking-wider mb-6 inline-block">
          ← Back to Houses
        </Link>

        <div className={`rounded-lg overflow-hidden border ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className={`p-6 md:p-8 border-b ${darkMode ? 'border-got-border' : 'border-gray-200'}`}>
            <h1 className={`font-cinzel text-2xl md:text-3xl font-bold mb-1 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>{house.name}</h1>

            {house.words && (
              <p className="text-got-gold font-crimson italic text-lg mt-2">
                &ldquo;{house.words}&rdquo;
              </p>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <InfoItem label="Region" value={house.region} darkMode={darkMode} />
              <InfoItem label="Coat of Arms" value={house.coatOfArms} darkMode={darkMode} />
              <InfoItem label="Seats" value={house.seats?.filter(Boolean).join(', ')} darkMode={darkMode} />
              <InfoItem label="Titles" value={house.titles?.filter(Boolean).join(', ')} darkMode={darkMode} />
              <InfoItem label="Founded" value={house.founded} darkMode={darkMode} />
              <InfoItem label="Died Out" value={house.diedOut} darkMode={darkMode} />

              {currentLord && (
                <div>
                  <span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Current Lord
                  </span>
                  <p>
                    <Link to={`/characters/${extractId(currentLord.url)}`} className="text-got-gold hover:text-got-gold-light text-sm">
                      {currentLord.name || currentLord.aliases?.[0] || 'Unknown'}
                    </Link>
                  </p>
                </div>
              )}

              {heir && (
                <div>
                  <span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Heir
                  </span>
                  <p>
                    <Link to={`/characters/${extractId(heir.url)}`} className="text-got-gold hover:text-got-gold-light text-sm">
                      {heir.name || heir.aliases?.[0] || 'Unknown'}
                    </Link>
                  </p>
                </div>
              )}

              {founder && (
                <div>
                  <span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Founder
                  </span>
                  <p>
                    <Link to={`/characters/${extractId(founder.url)}`} className="text-got-gold hover:text-got-gold-light text-sm">
                      {founder.name || founder.aliases?.[0] || 'Unknown'}
                    </Link>
                  </p>
                </div>
              )}

              {overlord && (
                <div>
                  <span className={`text-xs font-cinzel tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Overlord
                  </span>
                  <p>
                    <Link to={`/houses/${extractId(overlord.url)}`} className="text-got-gold hover:text-got-gold-light text-sm">
                      {overlord.name}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {members.length > 0 && (
              <div>
                <h2 className={`font-cinzel text-lg tracking-wider mb-4 ${
                  darkMode ? 'text-got-gold' : 'text-got-gold-dark'
                }`}>
                  Sworn Members ({members.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {members.map((member) => {
                    const charId = extractId(member.url);
                    const name = member.name || member.aliases?.[0] || 'Unknown';
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
                        <div className={`h-24 flex items-center justify-center overflow-hidden ${
                          darkMode ? 'bg-got-darker' : 'bg-gray-100'
                        }`}>
                          {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-cinzel text-sm font-bold ${
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

export default HouseDetail;
