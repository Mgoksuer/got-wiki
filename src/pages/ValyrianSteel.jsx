import { useTheme } from '../context/ThemeContext';
import { VALYRIAN_SWORDS } from '../services/images';

function ValyrianSteel() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-citadel' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/swords/oath.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-gray-900/50 to-black/85" />

        <div className="relative animate-fadeIn">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-3 tracking-wider">
            Valyrian Steel <span className="text-gray-300">Swords</span>
          </h1>
          <p className="text-gray-400 font-crimson text-lg italic max-w-xl mx-auto">
            Forged in dragonfire and sorcery in ancient Valyria &mdash; lighter, stronger, and sharper than any ordinary steel.
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mt-4" />
        </div>
      </div>

      {/* Sword Cards */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALYRIAN_SWORDS.map((sword, idx) => (
            <div key={sword.name}
              className={`group rounded-xl overflow-hidden border transition-all duration-500 card-hover-lift animate-fadeIn ${
                darkMode ? 'bg-got-card border-got-border hover:border-got-gold/40' : 'bg-white border-gray-200 hover:border-got-gold shadow-sm'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}>
              
              {/* Sword gradient bar with shine effect */}
              <div className={`h-2 bg-gradient-to-r ${sword.color} relative overflow-hidden`}>
                <div className="absolute inset-0 sword-shine" />
              </div>
              
              <div className="flex flex-col sm:flex-row">
                {/* Sword image */}
                {sword.image && (
                  <div className="sm:w-36 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-got-darker flex items-center justify-center p-3">
                    <img src={sword.image} alt={sword.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}

                <div className="p-5 flex-1">
                  {/* Sword name */}
                  <div className="flex items-start justify-between mb-3">
                    <h2 className={`font-cinzel text-lg font-bold tracking-wider group-hover:text-got-gold transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {sword.name}
                    </h2>
                    <span className={`text-[10px] font-cinzel tracking-wider px-2 py-0.5 rounded flex-shrink-0 ml-2 ${
                      sword.status === 'Active'
                        ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                        : sword.status.includes('Unknown')
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                          : 'bg-red-900/30 text-red-400 border border-red-800/50'
                    }`}>
                      {sword.status === 'Active' ? 'ACTIVE' : sword.status.includes('Unknown') ? 'UNKNOWN' : 'DESTROYED'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`font-crimson text-sm mb-4 leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {sword.description}
                  </p>

                  {/* Sword details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
                        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
                      }`}>Type</span>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sword.type}</p>
                    </div>
                    <div>
                      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
                        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
                      }`}>House</span>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sword.house}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-[10px] font-cinzel tracking-[0.15em] font-bold uppercase ${
                        darkMode ? 'text-got-gold/70' : 'text-got-gold-dark/70'
                      }`}>Notable Owner(s)</span>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sword.owner}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Valyrian Steel Lore */}
        <div className={`mt-12 rounded-xl border p-8 animate-fadeIn ${
          darkMode ? 'bg-got-card border-got-border' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`font-cinzel text-xl font-bold mb-4 tracking-wider ${
            darkMode ? 'text-got-gold' : 'text-got-gold-dark'
          }`}>
            About Valyrian Steel
          </h2>
          <div className="gold-separator mb-6" />
          <div className={`font-crimson space-y-4 text-sm leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p>
              Valyrian steel was forged in the ancient Valyrian Freehold using dragonfire and magical spells. 
              The secret of its making was lost when the Doom destroyed Valyria nearly four hundred years before 
              the events of the story.
            </p>
            <p>
              Valyrian steel blades are lighter, stronger, and sharper than even the finest castle-forged steel. 
              They never lose their edge and are easily recognizable by their distinctive rippled pattern. Only a 
              handful of these weapons remain in Westeros, making them priceless heirlooms.
            </p>
            <p>
              Crucially, Valyrian steel is one of the few substances known to be lethal to White Walkers, along 
              with dragonglass (obsidian). This made these ancient weapons invaluable during the Great War against 
              the Army of the Dead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValyrianSteel;
