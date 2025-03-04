import React, { useState, useEffect } from 'react';
import { Film, Star, Clock, Calendar, Search, Filter, Heart, BookmarkPlus, Play, Info } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  duration: string;
  genres: string[];
  description: string;
  director: string;
  cast: string[];
}

const MovieRecommendation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1980, 2025]);
  const [minRating, setMinRating] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
  ];

  // Sample movie data
  const sampleMovies: Movie[] = [
    {
      id: '1',
      title: 'Interstellar',
      year: 2014,
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.6,
      duration: '2h 49m',
      genres: ['Sci-Fi', 'Adventure', 'Drama'],
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain']
    },
    {
      id: '2',
      title: 'The Shawshank Redemption',
      year: 1994,
      poster: 'https://images.unsplash.com/photo-1507072384149-7d4eefb5e389?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 9.3,
      duration: '2h 22m',
      genres: ['Drama', 'Crime'],
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      director: 'Frank Darabont',
      cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    },
    {
      id: '3',
      title: 'The Dark Knight',
      year: 2008,
      poster: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 9.0,
      duration: '2h 32m',
      genres: ['Action', 'Crime', 'Drama'],
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart']
    },
    {
      id: '4',
      title: 'Pulp Fiction',
      year: 1994,
      poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.9,
      duration: '2h 34m',
      genres: ['Crime', 'Drama'],
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      director: 'Quentin Tarantino',
      cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson']
    },
    {
      id: '5',
      title: 'Spirited Away',
      year: 2001,
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.6,
      duration: '2h 5m',
      genres: ['Animation', 'Adventure', 'Fantasy'],
      description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
      director: 'Hayao Miyazaki',
      cast: ['Daveigh Chase', 'Suzanne Pleshette', 'Miyu Irino']
    },
    {
      id: '6',
      title: 'The Godfather',
      year: 1972,
      poster: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 9.2,
      duration: '2h 55m',
      genres: ['Crime', 'Drama'],
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      director: 'Francis Ford Coppola',
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan']
    },
    {
      id: '7',
      title: 'Inception',
      year: 2010,
      poster: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.8,
      duration: '2h 28m',
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page']
    },
    {
      id: '8',
      title: 'The Matrix',
      year: 1999,
      poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.7,
      duration: '2h 16m',
      genres: ['Action', 'Sci-Fi'],
      description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      director: 'Lana Wachowski, Lilly Wachowski',
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss']
    },
    {
      id: '9',
      title: 'Parasite',
      year: 2019,
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.6,
      duration: '2h 12m',
      genres: ['Comedy', 'Drama', 'Thriller'],
      description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      director: 'Bong Joon Ho',
      cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong']
    },
    {
      id: '10',
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
      poster: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.8,
      duration: '2h 58m',
      genres: ['Adventure', 'Drama', 'Fantasy'],
      description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      director: 'Peter Jackson',
      cast: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom']
    },
    {
      id: '11',
      title: 'Joker',
      year: 2019,
      poster: 'https://images.unsplash.com/photo-1559583109-3e7968136c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.4,
      duration: '2h 2m',
      genres: ['Crime', 'Drama', 'Thriller'],
      description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.',
      director: 'Todd Phillips',
      cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz']
    },
    {
      id: '12',
      title: 'Avengers: Endgame',
      year: 2019,
      poster: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      rating: 8.4,
      duration: '3h 1m',
      genres: ['Action', 'Adventure', 'Drama'],
      description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
      director: 'Anthony Russo, Joe Russo',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo']
    }
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    setMovies(sampleMovies);
    setFilteredMovies(sampleMovies);
  }, []);

  // Filter movies based on search, genres, year range, and rating
  useEffect(() => {
    let filtered = [...movies];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.director.toLowerCase().includes(query) ||
        movie.cast.some(actor => actor.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie => 
        selectedGenres.some(genre => movie.genres.includes(genre))
      );
    }
    
    // Filter by year range
    filtered = filtered.filter(movie => 
      movie.year >= yearRange[0] && movie.year <= yearRange[1]
    );
    
    // Filter by minimum rating
    filtered = filtered.filter(movie => movie.rating >= minRating);
    
    setFilteredMovies(filtered);
  }, [searchQuery, selectedGenres, yearRange, minRating, movies]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleYearRangeChange = (index: number, value: number) => {
    const newRange = [...yearRange] as [number, number];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    setYearRange(newRange);
  };

  const toggleFavorite = (movieId: string) => {
    if (favorites.includes(movieId)) {
      setFavorites(favorites.filter(id => id !== movieId));
    } else {
      setFavorites([...favorites, movieId]);
    }
  };

  const toggleWatchlist = (movieId: string) => {
    if (watchlist.includes(movieId)) {
      setWatchlist(watchlist.filter(id => id !== movieId));
    } else {
      setWatchlist([...watchlist, movieId]);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500 mb-4">
            Movie Recommendation App
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Never struggle to find what to watch again. Get personalized movie suggestions based on your viewing history and preferences.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, directors, actors..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Genres */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGenres.includes(genre)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      } transition-colors`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Year Range</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>From: {yearRange[0]}</span>
                    </div>
                    <input
                      type="range"
                      min="1920"
                      max="2025"
                      value={yearRange[0]}
                      onChange={(e) => handleYearRangeChange(0, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>To: {yearRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="1920"
                      max="2025"
                      value={yearRange[1]}
                      onChange={(e) => handleYearRangeChange(1, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Minimum Rating</h3>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Rating: {minRating}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenres([]);
                    setYearRange([1980, 2025]);
                    setMinRating(0);
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movie Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery || selectedGenres.length > 0 || minRating > 0 || yearRange[0] > 1980 || yearRange[1] < 2025
                ? 'Search Results'
                : 'Recommended Movies'}
            </h2>
            <p className="text-gray-400">{filteredMovies.length} movies found</p>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No movies match your filters. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(movie.id);
                          }}
                          className={`p-1.5 rounded-full ${
                            favorites.includes(movie.id) ? 'bg-red-600' : 'bg-gray-800/80 hover:bg-gray-700/80'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(movie.id) ? 'fill-white text-white' : 'text-white'}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(movie.id);
                          }}
                          className={`p-1.5 rounded-full ${
                            watchlist.includes(movie.id) ? 'bg-blue-600' : 'bg-gray-800/80 hover:bg-gray-700/80'
                          }`}
                        >
                          <BookmarkPlus className={`w-4 h-4 ${watchlist.includes(movie.id) ? 'fill-white text-white' : 'text-white'}`} />
                        </button>
                        <button
                          onClick={() => setSelectedMovie(movie)}
                          className="p-1.5 rounded-full bg-gray-800/80 hover:bg-gray-700/80"
                        >
                          <Info className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedMovie(movie)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 rounded-md transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-1" /> Watch Now
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-400 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{movie.year}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{movie.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(movie.rating)}
                      </div>
                      <span className="text-xs text-yellow-500">{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Movie Details Modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="relative">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                  <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                  <div className="flex items-center text-sm text-gray-300 mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{selectedMovie.year}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{selectedMovie.duration}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{selectedMovie.rating.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                    <p className="text-gray-300 mb-6">{selectedMovie.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-2">Director</h3>
                    <p className="text-gray-300 mb-6">{selectedMovie.director}</p>
                    
                    <h3 className="text-xl font-semibold mb-2">Cast</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedMovie.cast.map((actor, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-1/3">
                    <h3 className="text-xl font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedMovie.genres.map((genre, index) => (
                        <span key={index} className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 mr-2" /> Watch Now
                      </button>
                      <button
                        onClick={() => toggleFavorite(selectedMovie.id)}
                        className={`w-full ${
                          favorites.includes(selectedMovie.id)
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        } text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
                      >
                        <Heart className={`w-5 h-5 mr-2 ${favorites.includes(selectedMovie.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        {favorites.includes(selectedMovie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                      <button
                        onClick={() => toggleWatchlist(selectedMovie.id)}
                        className={`w-full ${
                          watchlist.includes(selectedMovie.id)
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        } text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
                      >
                        <BookmarkPlus className={`w-5 h-5 mr-2 ${watchlist.includes(selectedMovie.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                        {watchlist.includes(selectedMovie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRecommendation;