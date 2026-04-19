import { useTheme } from '../context/ThemeContext';

function LoadingSpinner() {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
        darkMode
          ? 'border-got-border border-t-got-gold'
          : 'border-gray-300 border-t-got-gold-dark'
      }`}></div>
      <p className={`mt-4 text-lg font-cinzel tracking-wider ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
