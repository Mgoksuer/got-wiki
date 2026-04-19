import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const sections = [
  {
    title: 'Characters',
    description: 'Browse the warriors, lords, and commoners of Westeros.',
    path: '/characters',
    bg: '/images/char.jpg',
  },
  {
    title: 'Houses',
    description: 'Discover the noble lineages and their sworn allegiances.',
    path: '/houses',
    bg: '/images/house.jpg',
  },
  {
    title: 'Books',
    description: 'Explore the compiled archives of the known world.',
    path: '/books',
    bg: '/images/book.jpg',
  },
  {
    title: 'Dragons',
    description: 'Fire and blood — the legendary beasts of Old Valyria.',
    path: '/dragons',
    bg: '/images/dragons/balerion.jpg',
  },
  {
    title: 'Valyrian Steel',
    description: 'The rarest and deadliest blades ever forged.',
    path: '/valyrian-steel',
    bg: '/images/swords/oath.jpg',
  },
];

function Home() {
  const { darkMode } = useTheme();

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative py-36 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-throne.jpg')" }} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute w-1 h-1 bg-got-gold/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto animate-fadeIn">
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-4 text-white leading-tight tracking-wide">
            THE <span className="text-got-gold animate-textGlow">CITADEL</span>
          </h1>
          <div className="w-24 h-0.5 bg-got-gold mx-auto mb-6 animate-glow" />
          <p className="text-gray-300 max-w-xl mx-auto text-lg font-crimson italic leading-relaxed">
            An encyclopedia of the world of Ice and Fire
          </p>
          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            <Link to="/characters"
              className="px-7 py-3 bg-got-gold text-got-darker font-cinzel text-sm tracking-wider rounded hover:bg-got-gold-light transition-all duration-300 font-semibold card-hover-lift">
              Explore Characters
            </Link>
            <Link to="/houses"
              className="px-7 py-3 border border-got-gold/60 text-got-gold font-cinzel text-sm tracking-wider rounded hover:bg-got-gold/10 transition-all duration-300">
              Browse Houses
            </Link>
            <Link to="/dragons"
              className="px-7 py-3 border border-red-700/60 text-red-400 font-cinzel text-sm tracking-wider rounded hover:bg-red-900/20 transition-all duration-300">
              Dragons
            </Link>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTIONS — blurred background image cards */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-citadel' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`font-cinzel text-2xl font-bold text-center mb-2 tracking-wider animate-slideUp ${
            darkMode ? 'text-got-gold' : 'text-got-gold-dark'
          }`}>Explore the Archives</h2>
          <div className="w-16 h-0.5 bg-got-gold mx-auto mb-10" />

          {/* First row: 3 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.slice(0, 3).map((s, i) => (
              <Link key={s.title} to={s.path}
                className="group relative block rounded-xl overflow-hidden h-56 border border-got-border hover:border-got-gold/50 transition-all duration-500 card-hover-lift animate-fadeIn"
                style={{ animationDelay: `${i * 120}ms` }}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${s.bg}')`,
                    filter: 'blur(3px)',
                  }} />
                <div className={`absolute inset-0 ${
                  darkMode ? 'bg-black/65 group-hover:bg-black/50' : 'bg-black/50 group-hover:bg-black/35'
                } transition-colors duration-500`} />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <h3 className="font-cinzel text-xl font-bold text-white tracking-wider mb-3 group-hover:text-got-gold transition-colors duration-300 uppercase">
                    {s.title}
                  </h3>
                  <div className="w-12 h-px bg-got-gold/50 mb-3 group-hover:w-20 transition-all duration-500" />
                  <p className="text-gray-300 text-sm font-crimson">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Second row: 2 items centered */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
            {sections.slice(3).map((s, i) => (
              <Link key={s.title} to={s.path}
                className="group relative block rounded-xl overflow-hidden h-56 border border-got-border hover:border-got-gold/50 transition-all duration-500 card-hover-lift animate-fadeIn sm:w-[calc(33.333%-0.5rem)] w-full"
                style={{ animationDelay: `${(i + 3) * 120}ms` }}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${s.bg}')`,
                    filter: 'blur(3px)',
                  }} />
                <div className={`absolute inset-0 ${
                  darkMode ? 'bg-black/65 group-hover:bg-black/50' : 'bg-black/50 group-hover:bg-black/35'
                } transition-colors duration-500`} />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <h3 className="font-cinzel text-xl font-bold text-white tracking-wider mb-3 group-hover:text-got-gold transition-colors duration-300 uppercase">
                    {s.title}
                  </h3>
                  <div className="w-12 h-px bg-got-gold/50 mb-3 group-hover:w-20 transition-all duration-500" />
                  <p className="text-gray-300 text-sm font-crimson">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
