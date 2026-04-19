import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const base = darkMode
    ? 'text-gray-300 hover:text-got-gold-light'
    : 'text-gray-700 hover:text-got-gold-dark';
  const active = 'bg-got-gold text-got-darker font-bold';

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded font-cinzel text-sm tracking-wide transition-colors ${isActive ? active : base}`;

  return (
    <nav className={`sticky top-0 z-50 shadow-lg border-b ${
      darkMode
        ? 'bg-got-darker/95 backdrop-blur-sm border-got-border'
        : 'bg-white/95 backdrop-blur-sm border-got-gold/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="w-7 h-7" />
            <span className={`font-cinzel font-bold text-lg tracking-widest ${
              darkMode ? 'text-got-gold' : 'text-got-gold-dark'
            }`}>
              The Citadel
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/books" className={linkClass}>Books</NavLink>
            <NavLink to="/characters" className={linkClass}>Characters</NavLink>
            <NavLink to="/houses" className={linkClass}>Houses</NavLink>
            <NavLink to="/dragons" className={linkClass}>Dragons</NavLink>
            <NavLink to="/valyrian-steel" className={linkClass}>Swords</NavLink>
            <button
              onClick={toggleDarkMode}
              className={`ml-4 p-2 rounded-full transition-colors cursor-pointer ${
                darkMode ? 'text-got-gold hover:bg-got-card' : 'text-got-gold-dark hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full cursor-pointer ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className={`p-2 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2 animate-slideDown">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/books" className={linkClass} onClick={() => setMenuOpen(false)}>Books</NavLink>
            <NavLink to="/characters" className={linkClass} onClick={() => setMenuOpen(false)}>Characters</NavLink>
            <NavLink to="/houses" className={linkClass} onClick={() => setMenuOpen(false)}>Houses</NavLink>
            <NavLink to="/dragons" className={linkClass} onClick={() => setMenuOpen(false)}>Dragons</NavLink>
            <NavLink to="/valyrian-steel" className={linkClass} onClick={() => setMenuOpen(false)}>Swords</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
