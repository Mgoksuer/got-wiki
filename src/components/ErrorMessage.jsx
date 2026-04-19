import { useTheme } from '../context/ThemeContext';

function ErrorMessage({ message }) {
  const { darkMode } = useTheme();

  return (
    <div className="flex items-center justify-center py-20">
      <div className={`px-6 py-4 rounded-lg max-w-md text-center border ${
        darkMode
          ? 'bg-red-900/30 border-red-800 text-red-300'
          : 'bg-red-50 border-red-300 text-red-700'
      }`}>
        <p className="font-cinzel font-semibold text-lg mb-1">Failed to load data</p>
        <p className="text-sm font-crimson">{message || 'An unexpected error occurred. Please try again later.'}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
