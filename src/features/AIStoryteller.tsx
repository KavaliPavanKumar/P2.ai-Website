import React, { useState } from 'react';
import { BookOpen, Sparkles, Copy, Download, RefreshCw, Bookmark } from 'lucide-react';

interface StoryPrompt {
  title: string;
  prompt: string;
  genre: string;
}

const AIStoryteller: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [storyLength, setStoryLength] = useState('medium');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedStories, setSavedStories] = useState<{title: string, content: string}[]>([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const storyPrompts: StoryPrompt[] = [
    { 
      title: "Lost in the Enchanted Forest",
      prompt: "A traveler gets lost in a magical forest where the trees whisper secrets.",
      genre: "fantasy"
    },
    { 
      title: "The Last Spaceship",
      prompt: "The last survivors of Earth embark on a journey to find a new habitable planet.",
      genre: "sci-fi"
    },
    { 
      title: "The Mysterious Neighbor",
      prompt: "A new neighbor moves in next door, but only appears at night and never during the day.",
      genre: "mystery"
    },
    { 
      title: "The Forgotten Artifact",
      prompt: "An archaeologist discovers an ancient artifact with unexplainable powers.",
      genre: "adventure"
    },
    { 
      title: "The Haunted Lighthouse",
      prompt: "A lighthouse keeper begins to experience strange occurrences during a violent storm.",
      genre: "horror"
    }
  ];

  const generateStory = () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    
    // Simulate AI story generation with a timeout
    setTimeout(() => {
      const storyIntros = {
        fantasy: "In a realm where magic flowed like water and dragons soared through crimson skies, ",
        "sci-fi": "The year was 2387, long after Earth had become uninhabitable. The colony ship Artemis drifted through the void, ",
        mystery: "The fog rolled in thick that Tuesday evening, obscuring the streetlights and muffling the sounds of the city. Detective Morgan paused, sensing something wasn't right, ",
        adventure: "The ancient map trembled in Eliza's weathered hands as she stood at the entrance of the forgotten temple. After years of searching, ",
        horror: "The old house on Blackwood Hill had been abandoned for decades. Local children whispered stories about the terrible things that happened there, "
      };
      
      const intro = storyIntros[genre as keyof typeof storyIntros] || "Once upon a time, ";
      
      // Generate a simple story based on the prompt
      const story = `${intro}${prompt.toLowerCase()}. 

The journey began unexpectedly, as all great adventures do. There was no warning, no preparation for what was to come. Yet somehow, it felt as though everything had been leading to this moment.

${genre === 'fantasy' ? 'The ancient prophecy spoke of a chosen one who would appear when the realm needed them most.' : ''}
${genre === 'sci-fi' ? 'The ship\'s AI calculated a 12.7% chance of survival, but humans had always defied the odds.' : ''}
${genre === 'mystery' ? 'Every clue seemed to lead to more questions, and time was running out.' : ''}
${genre === 'adventure' ? 'The map showed dangers ahead, but also promised treasures beyond imagination.' : ''}
${genre === 'horror' ? 'As night fell, the shadows seemed to move with a purpose of their own.' : ''}

Days turned into weeks, and challenges appeared at every turn. There were moments of doubt, of fear, of wondering if turning back might be the wiser choice. But something pushed onward - curiosity, determination, or perhaps simply the knowledge that some paths, once taken, cannot be abandoned.

"We must continue," said the leader, eyes reflecting both weariness and resolve. "What we seek lies just beyond."

${storyLength === 'short' ? 'And so the journey continued, into the unknown.' : ''}

${storyLength === 'medium' || storyLength === 'long' ? 'The group faced their greatest challenge yet when they encountered the guardian of the ancient secret. It tested not just their strength, but their wisdom and the purity of their intentions.' : ''}

${storyLength === 'long' ? 'Many had come before, seeking the same prize, driven by greed or ambition. Their remains served as warnings along the path. But this group was different - they sought not power for themselves, but salvation for all.' : ''}

In the end, what they discovered was not what they had expected, but perhaps what they needed all along. The true treasure was not gold or magic or technology, but understanding - of themselves, of each other, of the delicate balance that holds all things together.

And as they returned from their journey, changed in ways both visible and invisible, they carried with them a story that would be told for generations to come.`;
      
      setGeneratedStory(story);
      setIsGenerating(false);
      
      // Auto-generate a title if none exists
      if (!storyTitle) {
        const generatedTitle = `The ${genre === 'fantasy' ? 'Magical' : 
                                genre === 'sci-fi' ? 'Interstellar' : 
                                genre === 'mystery' ? 'Enigmatic' : 
                                genre === 'adventure' ? 'Daring' : 
                                'Mysterious'} ${prompt.split(' ').slice(0, 3).join(' ')}`;
        setStoryTitle(generatedTitle);
      }
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory);
  };

  const downloadStory = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedStory], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${storyTitle || 'generated-story'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveStory = () => {
    if (!generatedStory) return;
    
    const newSavedStories = [
      ...savedStories, 
      { 
        title: storyTitle || `Story ${savedStories.length + 1}`, 
        content: generatedStory 
      }
    ];
    setSavedStories(newSavedStories);
  };

  const usePrompt = (promptObj: StoryPrompt) => {
    setPrompt(promptObj.prompt);
    setGenre(promptObj.genre);
    setStoryTitle(promptObj.title);
  };

  const loadSavedStory = (index: number) => {
    const story = savedStories[index];
    setGeneratedStory(story.content);
    setStoryTitle(story.title);
    setShowSaved(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 mb-4">
            AI Storyteller
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Let our advanced AI craft engaging stories based on your prompts. Perfect for creative inspiration or entertaining content.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Story Generator */}
          <div className="lg:w-1/2 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-blue-400 mr-2" /> Story Generator
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Your Story Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a prompt for your story..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Science Fiction</option>
                    <option value="mystery">Mystery</option>
                    <option value="adventure">Adventure</option>
                    <option value="horror">Horror</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Story Length</label>
                  <select
                    value={storyLength}
                    onChange={(e) => setStoryLength(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Story Title (Optional)</label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="Enter a title for your story..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={generateStory}
                disabled={!prompt || isGenerating}
                className={`w-full flex items-center justify-center ${
                  !prompt || isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium py-3 px-4 rounded-lg transition-colors`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Generating Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" /> Generate Story
                  </>
                )}
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Try these prompts:</h3>
              <div className="grid grid-cols-1 gap-2">
                {storyPrompts.map((promptObj, index) => (
                  <div
                    key={index}
                    onClick={() => usePrompt(promptObj)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-blue-400">{promptObj.title}</h4>
                    <p className="text-sm text-gray-300">{promptObj.prompt}</p>
                    <span className="inline-block mt-2 text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                      {promptObj.genre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Story Display */}
          <div className="lg:w-1/2">
            {showSaved ? (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Bookmark className="w-6 h-6 text-blue-400 mr-2" /> Saved Stories
                  </h2>
                  <button
                    onClick={() => setShowSaved(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Back to Editor
                  </button>
                </div>

                {savedStories.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>You haven't saved any stories yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {savedStories.map((story, index) => (
                      <div
                        key={index}
                        onClick={() => loadSavedStory(index)}
                        className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 cursor-pointer transition-colors"
                      >
                        <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                        <p className="text-gray-300 line-clamp-3">{story.content.substring(0, 150)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <BookOpen className="w-6 h-6 text-blue-400 mr-2" /> Your Story
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowSaved(true)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Saved Stories"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {!generatedStory ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="max-w-md">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-semibold mb-2">Your story will appear here</h3>
                      <p className="text-gray-400">
                        Fill in the prompt, select your preferences, and click "Generate Story" to create your tale.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto bg-gray-700 rounded-lg p-6 mb-4 whitespace-pre-line">
                      <h3 className="text-2xl font-bold mb-4 text-blue-400">{storyTitle}</h3>
                      {generatedStory}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <Copy className="w-5 h-5 mr-2" /> Copy
                      </button>
                      <button
                        onClick={downloadStory}
                        className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 mr-2" /> Download
                      </button>
                      <button
                        onClick={saveStory}
                        className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <Bookmark className="w-5 h-5 mr-2" /> Save
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStoryteller;