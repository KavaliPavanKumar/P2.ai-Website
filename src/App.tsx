import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  MessageSquareText, 
  Music, 
  Film, 
  BrainCircuit,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  ChevronDown,
  Home
} from 'lucide-react';

// Import feature components
import MemeGenerator from './features/MemeGenerator';
import AIStoryteller from './features/AIStoryteller';
import MusicRecommender from './features/MusicRecommender';
import MovieRecommendation from './features/MovieRecommendation';
import QuizApp from './features/QuizApp';
import LandingPage from './LandingPage';

function App() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">P2.ai</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {isLandingPage ? (
              <>
                <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
                <a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a>
                <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
              </>
            ) : (
              <>
                <Link to="/meme-generator" className="hover:text-purple-400 transition-colors">Meme Generator</Link>
                <Link to="/ai-storyteller" className="hover:text-purple-400 transition-colors">AI Storyteller</Link>
                <Link to="/music-recommender" className="hover:text-purple-400 transition-colors">Music</Link>
                <Link to="/movie-recommendation" className="hover:text-purple-400 transition-colors">Movies</Link>
                <Link to="/quiz-app" className="hover:text-purple-400 transition-colors">Quiz</Link>
              </>
            )}
          </div>
          {!isLandingPage && (
            <Link to="/" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-full transition-all">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meme-generator" element={<MemeGenerator />} />
        <Route path="/ai-storyteller" element={<AIStoryteller />} />
        <Route path="/music-recommender" element={<MusicRecommender />} />
        <Route path="/movie-recommendation" element={<MovieRecommendation />} />
        <Route path="/quiz-app" element={<QuizApp />} />
      </Routes>
    </div>
  );
}

export default App;