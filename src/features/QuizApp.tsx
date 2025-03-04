import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle, XCircle, Clock, Award, BarChart, RefreshCw, ChevronRight, Save, Share2 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface QuizResult {
  date: string;
  category: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

const QuizApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [previousResults, setPreviousResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const categories: Category[] = [
    { 
      id: 'general', 
      name: 'General Knowledge', 
      icon: <BrainCircuit className="w-6 h-6" />, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      id: 'science', 
      name: 'Science & Nature', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v8L4.72 18.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2"></path><path d="M10 8a5 5 0 0 0 4 0"></path></svg>, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      id: 'history', 
      name: 'History', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, 
      color: 'from-amber-500 to-yellow-500' 
    },
    { 
      id: 'entertainment', 
      name: 'Entertainment', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 14c-1.23 0-2.47.37-3.5 1.07A6.38 6.38 0 0 0 12.5 14a6.38 6.38 0 0 0-3.5 1.07A6.53 6.53 0 0 0 5.5 14c-.95 0-1.88.18-2.75.53C1.34 15.06 1 16.28 1 17.5V20h18v-2.5c0-1.22-.34-2.44-1.25-2.97A5.7 5.7 0 0 0 19.5 14Z"></path><path d="M12.5 14c1.93 0 3.5-1.57 3.5-3.5V5.5C16 3.57 14.43 2 12.5 2S9 3.57 9 5.5v5c0 1.93 1.57 3.5 3.5 3.5Z"></path></svg>, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      id: 'geography', 
      name: 'Geography', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>, 
      color: 'from-red-500 to-orange-500' 
    },
    { 
      id: 'sports', 
      name: 'Sports', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle></svg>, 
      color: 'from-blue-600 to-indigo-600' 
    }
  ];

  // Sample questions for each category
  const categoryQuestions: Record<string, Question[]> = {
    general: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and most populous city of France."
      },
      {
        id: 2,
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is often called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface."
      },
      {
        id: 3,
        text: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        explanation: "The Mona Lisa was painted by Leonardo da Vinci, an Italian Renaissance polymath, between 1503 and 1519."
      },
      {
        id: 4,
        text: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface."
      },
      {
        id: 5,
        text: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: 1,
        explanation: "Oxygen has the chemical symbol 'O' and is the third most abundant element in the universe."
      }
    ],
    science: [
      {
        id: 1,
        text: "What is the hardest natural substance on Earth?",
        options: ["Platinum", "Diamond", "Quartz", "Titanium"],
        correctAnswer: 1,
        explanation: "Diamond is the hardest known natural material on Earth, scoring 10 on the Mohs scale of mineral hardness."
      },
      {
        id: 2,
        text: "Which of these is NOT a type of elementary particle?",
        options: ["Quark", "Lepton", "Boson", "Neutronium"],
        correctAnswer: 3,
        explanation: "Neutronium is not an elementary particle. It's a theoretical substance composed entirely of neutrons."
      },
      {
        id: 3,
        text: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "250,000 km/s"],
        correctAnswer: 0,
        explanation: "The speed of light in a vacuum is approximately 299,792,458 meters per second, often rounded to 300,000 kilometers per second."
      },
      {
        id: 4,
        text: "Which of these is NOT one of the four fundamental forces of nature?",
        options: ["Gravity", "Electromagnetic force", "Strong nuclear force", "Centrifugal force"],
        correctAnswer: 3,
        explanation: "The four fundamental forces are gravity, electromagnetic force, strong nuclear force, and weak nuclear force. Centrifugal force is a fictitious force."
      },
      {
        id: 5,
        text: "What is the most abundant gas in Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 2,
        explanation: "Nitrogen makes up about 78% of Earth's atmosphere, making it the most abundant gas."
      }
    ],
    history: [
      {
        id: 1,
        text: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: 1,
        explanation: "World War II ended in 1945 with the surrender of Nazi Germany in May and Japan in September."
      },
      {
        id: 2,
        text: "Who was the first Emperor of Rome?",
        options: ["Julius Caesar", "Augustus", "Nero", "Constantine"],
        correctAnswer: 1,
        explanation: "Augustus (born Octavian) was the first Roman Emperor, ruling from 27 BCE to 14 CE."
      },
      {
        id: 3,
        text: "The Renaissance period began in which country?",
        options: ["France", "England", "Italy", "Spain"],
        correctAnswer: 2,
        explanation: "The Renaissance began in Italy in the 14th century before spreading to the rest of Europe."
      },
      {
        id: 4,
        text: "Which ancient wonder was located in Alexandria?",
        options: ["The Hanging Gardens", "The Colossus", "The Lighthouse", "The Temple of Artemis"],
        correctAnswer: 2,
        explanation: "The Lighthouse (Pharos) of Alexandria was one of the Seven Wonders of the Ancient World, located in Alexandria, Egypt."
      },
      {
        id: 5,
        text: "Who wrote the Declaration of Independence?",
        options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"],
        correctAnswer: 1,
        explanation: "Thomas Jefferson was the principal author of the Declaration of Independence, with input from others including Benjamin Franklin and John Adams."
      }
    ],
    entertainment: [
      {
        id: 1,
        text: "Which actor played Iron Man in the Marvel Cinematic Universe?",
        options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
        correctAnswer: 2,
        explanation: "Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe from 2008 to 2019."
      },
      {
        id: 2,
        text: "Which band released the album 'Abbey Road'?",
        options: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Pink Floyd"],
        correctAnswer: 1,
        explanation: "Abbey Road was the eleventh studio album by the English rock band The Beatles, released in 1969."
      },
      {
        id: 3,
        text: "Who directed the movie 'Jaws'?",
        options: ["Steven Spielberg", "George Lucas", "Francis Ford Coppola", "Martin Scorsese"],
        correctAnswer: 0,
        explanation: "Jaws was directed by Steven Spielberg and released in 1975. It's considered the first summer blockbuster."
      },
      {
        id: 4,
        text: "Which TV show features the character Walter White?",
        options: ["The Walking Dead", "Breaking Bad", "Game of Thrones", "The Sopranos"],
        correctAnswer: 1,
        explanation: "Walter White is the main character in the TV series Breaking Bad, portrayed by Bryan Cranston."
      },
      {
        id: 5,
        text: "Who wrote the Harry Potter book series?",
        options: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Stephen King"],
        correctAnswer: 1,
        explanation: "The Harry Potter series was written by British author J.K. Rowling, with the first book published in 1997."
      }
    ],
    geography: [
      {
        id: 1,
        text: "Which is the largest desert in the world?",
        options: ["Gobi Desert", "Kalahari Desert", "Sahara Desert", "Antarctic Desert"],
        correctAnswer: 3,
        explanation: "The Antarctic Desert is the largest desert in the world, covering the entire continent of Antarctica."
      },
      {
        id: 2,
        text: "Which country has the most natural lakes?",
        options: ["United States", "Russia", "Canada", "Finland"],
        correctAnswer: 2,
        explanation: "Canada has more lakes than any other country, with over 2 million lakes covering about 9% of its territory."
      },
      {
        id: 3,
        text: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: 2,
        explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne as many people assume."
      },
      {
        id: 4,
        text: "Which mountain range separates Europe and Asia?",
        options: ["Alps", "Himalayas", "Andes", "Ural Mountains"],
        correctAnswer: 3,
        explanation: "The Ural Mountains form a natural boundary between Europe and Asia."
      },
      {
        id: 5,
        text: "Which country is both in Europe and Asia?",
        options: ["Russia", "Turkey", "Egypt", "Both A and B"],
        correctAnswer: 3,
        explanation: "Both Russia and Turkey have territory in both Europe and Asia , making them transcontinental countries."
      }
    ],
    sports: [
      {
        id: 1,
        text: "In which sport would you perform a slam dunk?",
        options: ["Volleyball", "Basketball", "Tennis", "Football"],
        correctAnswer: 1,
        explanation: "A slam dunk is a type of basketball shot that is performed when a player jumps in the air and manually powers the ball downward through the basket."
      },
      {
        id: 2,
        text: "How many players are there in a standard soccer team on the field?",
        options: ["9", "10", "11", "12"],
        correctAnswer: 2,
        explanation: "A standard soccer (football) team has 11 players on the field, including the goalkeeper."
      },
      {
        id: 3,
        text: "Which country has won the most FIFA World Cups?",
        options: ["Germany", "Italy", "Argentina", "Brazil"],
        correctAnswer: 3,
        explanation: "Brazil has won the FIFA World Cup five times (1958, 1962, 1970, 1994, and 2002), more than any other country."
      },
      {
        id: 4,
        text: "In which Olympic sport would you perform a vault?",
        options: ["Swimming", "Gymnastics", "Diving", "Track and Field"],
        correctAnswer: 1,
        explanation: "The vault is one of the events in artistic gymnastics, where athletes sprint down a runway and launch themselves over a stationary vault."
      },
      {
        id: 5,
        text: "How many Grand Slam tournaments are there in tennis?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "There are four Grand Slam tournaments in tennis: the Australian Open, French Open (Roland Garros), Wimbledon, and the US Open."
      }
    ]
  };

  useEffect(() => {
    // Load previous results from localStorage
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      setPreviousResults(JSON.parse(savedResults));
    }
  }, []);

  useEffect(() => {
    // Save results to localStorage whenever they change
    if (previousResults.length > 0) {
      localStorage.setItem('quizResults', JSON.stringify(previousResults));
    }
  }, [previousResults]);

  useEffect(() => {
    if (quizStarted && !quizFinished) {
      const interval = window.setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [quizStarted, quizFinished]);

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQuestions(categoryQuestions[categoryId]);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(0);
    setQuizFinished(false);
    setShowResults(false);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Save result
    const result: QuizResult = {
      date: new Date().toLocaleDateString(),
      category: categories.find(c => c.id === selectedCategory)?.name || '',
      score,
      totalQuestions: questions.length,
      timeSpent: timer
    };
    
    setPreviousResults(prev => [result, ...prev].slice(0, 10)); // Keep only the 10 most recent results
  };

  const resetQuiz = () => {
    setSelectedCategory(null);
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTimer(0);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 mb-4">
            Online Quiz App
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Test your knowledge with our interactive quizzes. Choose from various categories or create your own custom quiz to challenge friends.
          </p>
        </div>

        {!quizStarted && !showResults ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">Select a Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className={`p-6 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white`
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-600'
                      }`}>
                        {category.icon}
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <h3 className="text-xl font-semibold mb-4">
                  Ready to test your knowledge in {categories.find(c => c.id === selectedCategory)?.name}?
                </h3>
                <p className="text-gray-300 mb-6">
                  This quiz contains {categoryQuestions[selectedCategory].length} questions. Try to answer them as quickly and accurately as possible.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startQuiz}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r ${
                      categories.find(c => c.id === selectedCategory)?.color
                    } text-white font-medium transition-transform hover:scale-105`}
                  >
                    Start Quiz
                  </button>
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium"
                  >
                    View Previous Results
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : showResults && !quizStarted ? (
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Quiz History</h2>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Categories
              </button>
            </div>
            
            {previousResults.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">You haven't completed any quizzes yet. Take a quiz to see your results here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {previousResults.map((result, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{result.category}</h3>
                      <span className="text-sm text-gray-400">{result.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-yellow-500 mr-2" />
                        <span>
                          Score: <span className="font-semibold">{result.score}/{result.totalQuestions}</span>
                          <span className="text-sm text-gray-400 ml-2">
                            ({Math.round((result.score / result.totalQuestions) * 100)}%)
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-500 mr-2" />
                        <span>Time: {formatTime(result.timeSpent)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium transition-transform hover:scale-105"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {!quizFinished ? (
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Quiz Header */}
                <div className="bg-gray-700 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-300">{formatTime(timer)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 h-2 rounded-full mt-3">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${categories.find(c => c.id === selectedCategory)?.color}`}
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                  </div>
                </div>
                
                {/* Question */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6">{questions[currentQuestionIndex]?.text}</h3>
                  
                  <div className="space-y-3">
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedOption === index
                            ? isAnswered
                              ? index === questions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-600/20 border border-green-600'
                                : 'bg-red-600/20 border border-red-600'
                              : 'bg-gray-600 border border-gray-500'
                            : isAnswered
                              ? index === questions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-600/20 border border-green-600'
                                : 'bg-gray-700 border border-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 border border-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            selectedOption === index
                              ? isAnswered
                                ? index === questions[currentQuestionIndex].correctAnswer
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                                : 'bg-gray-500 text-white'
                              : isAnswered
                                ? index === questions[currentQuestionIndex].correctAnswer
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-600 text-white'
                                : 'bg-gray-600 text-white'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                          {isAnswered && (
                            <>
                              {index === questions[currentQuestionIndex].correctAnswer && (
                                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                              )}
                              {selectedOption === index && index !== questions[currentQuestionIndex].correctAnswer && (
                                <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                              )}
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {isAnswered && !showExplanation && (
                    <button
                      onClick={() => setShowExplanation(true)}
                      className="mt-6 text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                    >
                      <Info className="w-4 h-4 mr-1" /> Show Explanation
                    </button>
                  )}
                  
                  {showExplanation && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-gray-300">{questions[currentQuestionIndex]?.explanation}</p>
                    </div>
                  )}
                </div>
                
                {/* Navigation */}
                <div className="bg-gray-700 p-4 flex justify-between">
                  <button
                    onClick={resetQuiz}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Quit Quiz
                  </button>
                  {isAnswered && (
                    <button
                      onClick={nextQuestion}
                      className={`px-4 py-2 rounded-lg bg-gradient-to-r ${
                        categories.find(c => c.id === selectedCategory)?.color
                      } text-white font-medium flex items-center`}
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                  <p className="text-gray-300">
                    You scored {score} out of {questions.length} questions
                  </p>
                  <div className="text-3xl font-bold my-4">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <p className="text-gray-400">
                    Time taken: {formatTime(timer)}
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3">Performance Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Correct Answers</span>
                        <span>{score} / {questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-600 h-2 rounded-full">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${(score / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Incorrect Answers</span>
                        <span>{questions.length - score} / {questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-600 h-2 rounded-full">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{ width: `${((questions.length - score) / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium flex items-center justify-center"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" /> Try Another Quiz
                  </button>
                  <button
                    onClick={() => {
                      startQuiz();
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium flex items-center justify-center"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" /> Retry This Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;