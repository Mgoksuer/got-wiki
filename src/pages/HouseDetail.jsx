import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHouse, getResourceByUrl, extractId } from '../services/api';
import { getCharacterImage, getHouseColors, getInitials } from '../services/images';
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

  const colors = getHouseColors(house.name);
  const accentColor = colors?.primary || '#b8860b';
  const labelCls = `font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`;
  const cardCls = darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-got.jpg')" }} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-black/80 via-[#0d1117]/90 to-[#0d1117]' : 'bg-gradient-to-b from-black/70 via-gray-900/80 to-gray-50'}`} />

        {/* Accent stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-28">
          <Link to="/houses" className="text-got-gold/80 hover:text-got-gold font-cinzel text-xs tracking-widest uppercase mb-6 inline-flex items-center gap-2 transition-colors">
            <span>&#8592;</span> Back to Houses
          </Link>

          <div className="animate-fadeIn mt-2">
            <div className="flex items-center gap-4 mb-2">
              {/* House initial badge */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-white/10"
                style={{ background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)` }}>
                <span className="font-cinzel text-2xl font-bold" style={{ color: accentColor }}>
                  {house.name.replace('House ', '')[0]}
                </span>
              </div>
              <div>
                <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white tracking-wider">{house.name}</h1>
                {house.words && (
                  <p className="font-crimson italic text-lg mt-1" style={{ color: accentColor }}>
                    &ldquo;{house.words}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {house.region && (
              <p className="text-gray-400 text-sm font-crimson mt-3 ml-20">
                Region: <span className="text-gray-300">{house.region}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content — overlapping cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn" style={{ animationDelay: '150ms' }}>

          {/* Left: House Info */}
          <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
            <h2 className={`${labelCls} text-xs mb-4`}>House Details</h2>
            <div className="w-10 h-px mb-4" style={{ backgroundColor: `${accentColor}40` }} />

            <div className="space-y-3">
              <InfoItem label="Coat of Arms" value={house.coatOfArms} darkMode={darkMode} />
              <InfoItem label="Seats" value={house.seats?.filter(Boolean).join(', ')} darkMode={darkMode} />
              <InfoItem label="Titles" value={house.titles?.filter(Boolean).join(', ')} darkMode={darkMode} />
              <InfoItem label="Founded" value={house.founded} darkMode={darkMode} />
              {house.diedOut && <InfoItem label="Died Out" value={house.diedOut} darkMode={darkMode} isDanger />}
            </div>

            {/* Key figures */}
            {(currentLord || heir || founder || overlord) && (
              <>
                <div className={`w-full h-px my-4 ${darkMode ? 'bg-got-border' : 'bg-gray-200'}`} />
                <h3 className={`${labelCls} text-xs mb-3`}>Key Figures</h3>
                <div className="space-y-2">
                  {currentLord && (
                    <FigureLink label="Current Lord" person={currentLord} type="characters" />
                  )}
                  {heir && (
                    <FigureLink label="Heir" person={heir} type="characters" />
                  )}
                  {founder && (
                    <FigureLink label="Founder" person={founder} type="characters" />
                  )}
                  {overlord && (
                    <FigureLink label="Overlord" person={overlord} type="houses" />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Sworn Members */}
          <div className="lg:col-span-2">
            {members.length > 0 && (
              <div className={`rounded-xl border p-5 ${cardCls} shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${labelCls} text-xs`}>Sworn Members</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-got-card-light text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>{members.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {members.map((member) => {
                    const charId = extractId(member.url);
                    const mname = member.name || member.aliases?.[0] || 'Unknown';
                    const mimage = getCharacterImage(mname);

                    return (
                      <Link key={charId} to={`/characters/${charId}`}
                        className={`group block rounded-lg overflow-hidden transition-all border card-hover-lift ${
                          darkMode
                            ? 'bg-got-card-light border-got-border hover:border-got-gold/40'
                            : 'bg-gray-50 border-gray-200 hover:border-got-gold/40'
                        }`}>
                        <div className={`h-24 flex items-center justify-center overflow-hidden ${
                          darkMode ? 'bg-got-darker' : 'bg-gray-100'
                        }`}>
                          {mimage ? (
                            <img src={mimage} alt={mname} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-cinzel text-xs font-bold ${
                              darkMode ? 'bg-got-border text-got-gold' : 'bg-gray-200 text-got-gold-dark'
                            }`}>
                              {getInitials(mname)}
                            </div>
                          )}
                        </div>
                        <p className={`py-2.5 px-2 text-xs font-cinzel tracking-wide truncate text-center group-hover:text-got-gold transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {mname}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className={`rounded-xl border p-8 text-center ${cardCls} shadow-lg`}>
                <p className={`font-crimson italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No sworn members recorded in the annals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, darkMode, isDanger }) {
  if (!value) return null;
  return (
    <div>
      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
      }`}>{label}</span>
      <p className={`text-sm mt-0.5 ${
        isDanger ? 'text-red-400' : darkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>{value}</p>
    </div>
  );
}

function FigureLink({ label, person, type }) {
  const pname = person.name || person.aliases?.[0] || 'Unknown';
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] font-cinzel tracking-wider text-gray-500 uppercase">{label}</span>
      <Link to={`/${type}/${extractId(person.url)}`} className="text-got-gold hover:text-got-gold-light text-sm font-semibold transition-colors">
        {pname}
      </Link>
    </div>
  );
}

export default HouseDetail;
