import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import Houses from './pages/Houses';
import HouseDetail from './pages/HouseDetail';
import Dragons from './pages/Dragons';
import ValyrianSteel from './pages/ValyrianSteel';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-got-dark">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/houses/:id" element={<HouseDetail />} />
              <Route path="/dragons" element={<Dragons />} />
              <Route path="/valyrian-steel" element={<ValyrianSteel />} />
            </Routes>
          </main>
          <Footer />
          <MusicPlayer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
