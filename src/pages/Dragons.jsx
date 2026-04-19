import { useTheme } from '../context/ThemeContext';
import { DRAGONS } from '../services/images';

function Dragons() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/dragons/drogon.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-red-950/30 to-black/80" />

        <div className="relative animate-fadeIn">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-3 tracking-wider">
            Dragons of <span className="text-red-400">Valyria</span>
          </h1>
          <p className="text-gray-400 font-crimson text-lg italic max-w-xl mx-auto">
            &ldquo;Fire and Blood&rdquo; &mdash; the words of House Targaryen and the legacy of dragonkind.
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-4" />
        </div>
      </div>

      {/* Dragon Cards */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="space-y-8">
          {DRAGONS.map((dragon, idx) => (
            <div key={dragon.name}
              className={`rounded-xl overflow-hidden border transition-all duration-500 card-hover-lift animate-fadeIn ${
                dragon.borderColor
              } ${darkMode ? 'bg-got-card' : 'bg-white shadow-md'}`}
              style={{ animationDelay: `${idx * 150}ms` }}>
              
              {/* Top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${dragon.colorClass}`} />
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Dragon image */}
                  <div className={`flex-shrink-0 w-full md:w-56 h-44 rounded-lg overflow-hidden ${dragon.glowColor} shadow-lg`}>
                    {dragon.image ? (
                      <img src={dragon.image} alt={dragon.name}
                        className="w-full h-full object-cover animate-breathe" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${dragon.colorClass} flex items-center justify-center`}>
                        <span className="font-cinzel text-4xl font-bold text-white/30">{dragon.name[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Dragon info */}
                  <div className="flex-1">
                    <h2 className={`font-cinzel text-2xl font-bold mb-2 tracking-wider ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {dragon.name}
                    </h2>
                    
                    <p className={`font-crimson text-sm mb-4 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {dragon.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoItem label="Rider(s)" value={dragon.rider} darkMode={darkMode} />
                      <InfoItem label="Color" value={dragon.color} darkMode={darkMode} />
                      <InfoItem label="Named After" value={dragon.namedAfter} darkMode={darkMode} />
                      <InfoItem label="Status" value={dragon.status} darkMode={darkMode} isStatus />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lore section */}
        <div className={`mt-12 rounded-xl border p-8 animate-fadeIn ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`font-cinzel text-xl font-bold mb-4 tracking-wider ${
            darkMode ? 'text-got-gold' : 'text-got-gold-dark'
          }`}>
            Dragon Lore
          </h2>
          <div className="gold-separator mb-6" />
          <div className={`font-crimson space-y-4 text-sm leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p>
              Dragons are massive, flying reptiles that can breathe fire. They are the nuclear weapons of 
              the world of A Song of Ice and Fire. Originally from the Valyrian Freehold, dragons were used 
              by Valyrian dragonlords for thousands of years before the Doom destroyed their civilization.
            </p>
            <p>
              The Targaryens were the only dragonlord family to survive the Doom, having relocated to 
              Dragonstone twelve years before the catastrophe. Aegon I Targaryen and his sister-wives used 
              their three dragons &mdash; Balerion, Meraxes, and Vhagar &mdash; to conquer six of the Seven Kingdoms 
              during the War of Conquest.
            </p>
            <p>
              Dragons are intelligent creatures that form deep bonds with their riders. A dragon will only 
              accept one rider at a time, though a rider may ride different dragons throughout their life. 
              The bond between dragon and rider is so strong that the death of one often leads to the 
              decline of the other.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, darkMode, isStatus }) {
  if (!value) return null;
  const isDead = isStatus && value.toLowerCase().includes('dead');
  return (
    <div>
      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
      }`}>{label}</span>
      <p className={`text-sm mt-0.5 ${
        isDead ? 'text-red-400' :
        darkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>{value}</p>
    </div>
  );
}

export default Dragons;
