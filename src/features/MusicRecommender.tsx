import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Heart, Share2, Plus, Search, ListMusic, Radio } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  genre: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
}

const MusicRecommender: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState('energetic');
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<{name: string, songs: Song[]}[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Latin', 'Metal'
  ];

  const moods = [
    { value: 'energetic', label: 'Energetic', color: 'from-red-500 to-orange-500' },
    { value: 'relaxed', label: 'Relaxed', color: 'from-blue-500 to-cyan-500' },
    { value: 'happy', label: 'Happy', color: 'from-yellow-500 to-amber-500' },
    { value: 'melancholic', label: 'Melancholic', color: 'from-purple-500 to-indigo-500' },
    { value: 'focused', label: 'Focused', color: 'from-green-500 to-emerald-500' }
  ];

  // Sample data for playlists
  const samplePlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Summer Vibes',
      description: 'Perfect playlist for sunny days and good times',
      cover: 'https://images.unsplash.com/photo-1534196511436-921a4e99f297?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      songs: [
        { id: '101', title: 'Summer Nights', artist: 'The Beach Band', album: 'Endless Summer', cover: 'https://images.unsplash.com/photo-1595971294624-80bcf0d7eb24?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '3:45', genre: 'Pop' },
        { id: '102', title: 'Ocean Waves', artist: 'Coastal Dreams', album: 'Seaside', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '4:20', genre: 'Pop' },
        { id: '103', title: 'Sunset Drive', artist: 'Highway Cruisers', album: 'Open Roads', cover: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '3:55', genre: 'Rock' },
      ]
    },
    {
      id: '2',
      name: 'Chill Study Session',
      description: 'Focus-enhancing tracks for productive study sessions',
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      songs: [
        { id: '201', title: 'Deep Focus', artist: 'Mind Waves', album: 'Concentration', cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '5:30', genre: 'Electronic' },
        { id: '202', title: 'Ambient Study', artist: 'Brain Boost', album: 'Mental Clarity', cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '6:15', genre: 'Classical' },
        { id: '203', title: 'Night Reading', artist: 'Page Turner', album: 'Quiet Hours', cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '4:45', genre: 'Jazz' },
      ]
    },
    {
      id: '3',
      name: 'Workout Intensity',
      description: 'High-energy tracks to fuel your workout',
      cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      songs: [
        { id: '301', title: 'Power Up', artist: 'Fitness Beats', album: 'Gym Sessions', cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '3:30', genre: 'Electronic' },
        { id: '302', title: 'Run Faster', artist: 'Cardio Kings', album: 'Heart Rate', cover: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '4:10', genre: 'Hip Hop' },
        { id: '303', title: 'Last Rep', artist: 'Iron Pumpers', album: 'No Pain No Gain', cover: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '3:50', genre: 'Rock' },
      ]
    },
    {
      id: '4',
      name: 'Rainy Day Jazz',
      description: 'Smooth jazz for those cozy rainy days',
      cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      songs: [
        { id: '401', title: 'Rainy Saxophone', artist: 'Blue Notes', album: 'Midnight Sessions', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '5:45', genre: 'Jazz' },
        { id: '402', title: 'Coffee Shop Piano', artist: 'Ivory Dreams', album: 'Urban Melodies', cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '4:30', genre: 'Jazz' },
        { id: '403', title: 'Window Droplets', artist: 'Ambient Moods', album: 'Weather Patterns', cover: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '6:20', genre: 'Jazz' },
      ]
    },
    {
      id: '5',
      name: 'Road Trip Classics',
      description: 'Timeless hits for the open road',
      cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      songs: [
        { id: '501', title: 'Highway Freedom', artist: 'The Travelers', album: 'Open Roads', cover: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '4:15', genre: 'Rock' },
        { id: '502', title: 'Desert Cruising', artist: 'Sunset Riders', album: 'Western Skies', cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '5:05', genre: 'Country' },
        { id: '503', title: 'City Lights Ahead', artist: 'Urban Nomads', album: 'Metropolitan', cover: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', duration: '3:40', genre: 'Pop' },
      ]
    }
  ];

  // Filter playlists based on search, genres, and mood
  useEffect(() => {
    let filtered = [...samplePlaylists];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(playlist => 
        playlist.name.toLowerCase().includes(query) || 
        playlist.description.toLowerCase().includes(query) ||
        playlist.songs.some(song => 
          song.title.toLowerCase().includes(query) || 
          song.artist.toLowerCase().includes(query)
        )
      );
    }
    
    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(playlist => 
        playlist.songs.some(song => 
          selectedGenres.includes(song.genre)
        )
      );
    }
    
    // Sort by mood (in a real app, this would use more sophisticated logic)
    if (mood) {
      filtered.sort((a, b) => {
        // This is a simplified example - in a real app, each song would have mood attributes
        if (mood === 'energetic') {
          return b.songs.filter(s => ['Rock', 'Electronic', 'Hip Hop'].includes(s.genre)).length - 
                 a.songs.filter(s => ['Rock', 'Electronic', 'Hip Hop'].includes(s.genre)).length;
        } else if (mood === 'relaxed') {
          return b.songs.filter(s => ['Jazz', 'Classical', 'R&B'].includes(s.genre)).length - 
                 a.songs.filter(s => ['Jazz', 'Classical', 'R&B'].includes(s.genre)).length;
        } else if (mood === 'happy') {
          return b.songs.filter(s => ['Pop', 'Latin', 'Country'].includes(s.genre)).length - 
                 a.songs.filter(s => ['Pop', 'Latin', 'Country'].includes(s.genre)).length;
        } else if (mood === 'melancholic') {
          return b.songs.filter(s => ['Classical', 'Jazz', 'R&B'].includes(s.genre)).length - 
                 a.songs.filter(s => ['Classical', 'Jazz', 'R&B'].includes(s.genre)).length;
        } else if (mood === 'focused') {
          return b.songs.filter(s => ['Classical', 'Electronic', 'Jazz'].includes(s.genre)).length - 
                 a.songs.filter(s => ['Classical', 'Electronic', 'Jazz'].includes(s.genre)).length;
        }
        return 0;
      });
    }
    
    setRecommendedPlaylists(filtered);
  }, [searchQuery, selectedGenres, mood]);

  // Simulate playback progress
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying && currentPlaylist) {
      interval = window.setInterval(() => {
        setCurrentTime(prevTime => {
          // Assuming each song is about 4 minutes (240 seconds) for this demo
          const songDuration = 240;
          
          if (prevTime >= songDuration) {
            // Move to next song
            if (currentSongIndex < currentPlaylist.songs.length - 1) {
              setCurrentSongIndex(prevIndex => prevIndex + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          
          return prevTime + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentPlaylist, currentSongIndex]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const playPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      setUserPlaylists([...userPlaylists, { name: newPlaylistName, songs: [] }]);
      setNewPlaylistName('');
      setShowPlaylistModal(false);
    }
  };

  const addToPlaylist = (playlistIndex: number, song: Song) => {
    const updatedPlaylists = [...userPlaylists];
    if (!updatedPlaylists[playlistIndex].songs.some(s => s.id === song.id)) {
      updatedPlaylists[playlistIndex].songs.push(song);
      setUserPlaylists(updatedPlaylists);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
            Music Playlist Recommender
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover new music tailored to your taste. Our algorithm analyzes your preferences to create the perfect playlist for any mood.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search music..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Genres */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedGenres.includes(genre)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } transition-colors`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Mood</h3>
              <div className="space-y-2">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(moodOption.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                      mood === moodOption.value
                        ? `bg-gradient-to-r ${moodOption.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } transition-colors`}
                  >
                    <Radio className={`w-4 h-4 mr-2 ${mood === moodOption.value ? 'text-white' : 'text-gray-400'}`} />
                    {moodOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Playlists */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Playlists</h3>
                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className="text-green-500 hover:text-green-400"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {userPlaylists.length === 0 ? (
                <p className="text-gray-400 text-sm">No playlists yet. Create one!</p>
              ) : (
                <div className="space-y-2">
                  {userPlaylists.map((playlist, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <ListMusic className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{playlist.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{playlist.songs.length} songs</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Recommended Playlists */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Recommended Playlists</h2>
              
              {recommendedPlaylists.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No playlists match your filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => playPlaylist(playlist)}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-16 h-16 text-white" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{playlist.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{playlist.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">{playlist.songs.length} songs</span>
                          <button
                            onClick={() => playPlaylist(playlist)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-full transition-colors"
                          >
                            Play
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Now Playing */}
            {currentPlaylist && (
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 pb-0">
                  <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-6">
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <img
                        src={currentPlaylist.songs[currentSongIndex].cover}
                        alt={currentPlaylist.songs[currentSongIndex].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg">{currentPlaylist.songs[currentSongIndex].title}</h3>
                    <p className="text-gray-400">{currentPlaylist.songs[currentSongIndex].artist}</p>
                    <p className="text-gray-500 text-sm">{currentPlaylist.songs[currentSongIndex].album}</p>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{currentPlaylist.songs[currentSongIndex].duration}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(currentTime / 240) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-6 mb-8">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Heart className="w-6 h-6" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={nextSong}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Up Next in {currentPlaylist.name}</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {currentPlaylist.songs.map((song, index) => (
                          <div
                            key={song.id}
                            onClick={() => {
                              setCurrentSongIndex(index);
                              setCurrentTime(0);
                              setIsPlaying(true);
                            }}
                            className={`flex items-center p-2 rounded-lg cursor-pointer ${
                              index === currentSongIndex
                                ? 'bg-green-600 bg-opacity-20 border border-green-600'
                                : 'hover:bg-gray-700'
                            }`}
                          >
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{song.title}</p>
                              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                            </div>
                            <span className="text-sm text-gray-400 ml-2">{song.duration}</span>
                            {userPlaylists.length > 0 && (
                              <div className="relative ml-2 group">
                                <button className="text-gray-400 hover:text-white p-1">
                                  <Plus className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-10 hidden group-hover:block">
                                  <div className="py-2">
                                    <p className="px-4 py-1 text-sm text-gray-400">Add to playlist:</p>
                                    {userPlaylists.map((playlist, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToPlaylist(idx, song);
                                        }}
                                        className="px-4 py-2 text-sm text-left w-full hover:bg-gray-700"
                                      >
                                        {playlist.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Playlist</h3>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Playlist Name</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPlaylist}
                disabled={!newPlaylistName.trim()}
                className={`px-4 py-2 rounded-lg ${
                  newPlaylistName.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                } transition-colors`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicRecommender;