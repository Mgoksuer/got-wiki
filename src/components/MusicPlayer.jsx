import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const TRACKS = [
  { name: 'Main Theme', file: '/music/main-theme.mp3' },
  { name: 'Mhysa', file: '/music/mhysa.mp3' },
  { name: 'Heir to Winterfell', file: '/music/heir-to-winterfell.mp3' },
];

function MusicPlayer() {
  const { darkMode } = useTheme();
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }

  function changeTrack(index) {
    setCurrentTrack(index);
    setPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
    }, 100);
  }

  function handleEnded() {
    changeTrack((currentTrack + 1) % TRACKS.length);
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-xl border transition-all ${
      darkMode ? 'bg-got-darker/95 border-got-border backdrop-blur-sm' : 'bg-white/95 border-got-gold/30 backdrop-blur-sm'
    } ${expanded ? 'w-64' : 'w-auto'}`}>
      <audio ref={audioRef} src={TRACKS[currentTrack].file} onEnded={handleEnded} preload="auto" />

      {expanded ? (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-cinzel text-xs tracking-wider ${darkMode ? 'text-got-gold' : 'text-got-gold-dark'}`}>
              Soundtrack
            </span>
            <button onClick={() => setExpanded(false)}
              className={`text-sm cursor-pointer leading-none ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
              ✕
            </button>
          </div>

          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {TRACKS[currentTrack].name}
          </p>

          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => changeTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length)}
              className={`cursor-pointer text-sm ${darkMode ? 'text-gray-400 hover:text-got-gold' : 'text-gray-500 hover:text-got-gold-dark'}`}>⏮</button>
            <button onClick={togglePlay}
              className="text-xl cursor-pointer text-got-gold hover:text-got-gold-light">
              {playing ? '⏸' : '▶️'}
            </button>
            <button onClick={() => changeTrack((currentTrack + 1) % TRACKS.length)}
              className={`cursor-pointer text-sm ${darkMode ? 'text-gray-400 hover:text-got-gold' : 'text-gray-500 hover:text-got-gold-dark'}`}>⏭</button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>🔈</span>
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 accent-got-gold cursor-pointer" />
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>🔊</span>
          </div>

          <div className={`border-t pt-2 ${darkMode ? 'border-got-border' : 'border-gray-200'}`}>
            {TRACKS.map((track, i) => (
              <button key={i} onClick={() => changeTrack(i)}
                className={`block w-full text-left text-xs py-1.5 px-2 rounded cursor-pointer transition-colors ${
                  i === currentTrack
                    ? 'text-got-gold font-semibold'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {i === currentTrack && playing ? '♪ ' : ''}{track.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setExpanded(true)}
          className={`p-3 cursor-pointer flex items-center gap-2 rounded-lg ${
            darkMode ? 'hover:bg-got-card' : 'hover:bg-gray-100'
          }`}
          title="Open Music Player">
          <span className="text-got-gold text-lg">{playing ? '♪' : '♫'}</span>
          {playing && (
            <span className={`text-xs font-crimson ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {TRACKS[currentTrack].name}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default MusicPlayer;
