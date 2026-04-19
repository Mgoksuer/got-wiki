import { useTheme } from '../context/ThemeContext';

function Pagination({ page, hasNext, hasPrev, onPageChange }) {
  const { darkMode } = useTheme();

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={`px-4 py-2 rounded-lg font-cinzel text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
          darkMode
            ? 'bg-got-card border border-got-border text-gray-300 hover:bg-got-card-light hover:text-got-gold'
            : 'bg-white border border-gray-300 text-gray-600 hover:border-got-gold hover:text-got-gold-dark'
        }`}
      >
        ← Previous
      </button>
      <span className={`font-cinzel text-sm tracking-wider ${
        darkMode ? 'text-got-gold' : 'text-got-gold-dark'
      }`}>
        Page {page}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={`px-4 py-2 rounded-lg font-cinzel text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
          darkMode
            ? 'bg-got-card border border-got-border text-gray-300 hover:bg-got-card-light hover:text-got-gold'
            : 'bg-white border border-gray-300 text-gray-600 hover:border-got-gold hover:text-got-gold-dark'
        }`}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
