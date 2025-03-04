import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';

function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Sparkles className="w-12 h-12 text-purple-500" />,
      title: "Meme Generator",
      description: "Create viral-worthy memes in seconds with our intuitive meme generator. Add custom text, images, and effects with just a few clicks.",
      color: "from-purple-500 to-pink-500",
      link: "/meme-generator"
    },
    {
      icon: <MessageSquareText className="w-12 h-12 text-blue-500" />,
      title: "AI Storyteller",
      description: "Let our advanced AI craft engaging stories based on your prompts. Perfect for creative inspiration or entertaining content.",
      color: "from-blue-500 to-cyan-400",
      link: "/ai-storyteller"
    },
    {
      icon: <Music className="w-12 h-12 text-green-500" />,
      title: "Music Playlist Recommender",
      description: "Discover new music tailored to your taste. Our algorithm analyzes your preferences to create the perfect playlist for any mood.",
      color: "from-green-500 to-emerald-400",
      link: "/music-recommender"
    },
    {
      icon: <Film className="w-12 h-12 text-red-500" />,
      title: "Movie Recommendation App",
      description: "Never struggle to find what to watch again. Get personalized movie suggestions based on your viewing history and preferences.",
      color: "from-red-500 to-orange-400",
      link: "/movie-recommendation"
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-yellow-500" />,
      title: "Online Quiz App",
      description: "Test your knowledge with our interactive quizzes. Choose from various categories or create your own custom quiz to challenge friends.",
      color: "from-yellow-500 to-amber-400",
      link: "/quiz-app"
    }
  ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 z-0">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Build Faster. Create Better.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Unleash your creativity with Bolt.new - the ultimate platform for building stunning applications in record time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button onClick={scrollToFeatures} className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-gray-700 hover:border-gray-600">
              Watch Demo
            </button>
          </div>
          <button 
            onClick={scrollToFeatures}
            className="animate-bounce bg-gray-800/50 hover:bg-gray-700/50 p-3 rounded-full transition-all duration-300"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Bolt.new comes packed with everything you need to build amazing applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-gray-600"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See Bolt.new in Action</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the power and flexibility of our platform
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeFeature === index ? `bg-gradient-to-r ${feature.color} text-white` : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{feature.title}</h3>
                        <p className={`text-sm ${activeFeature === index ? 'text-white/80' : 'text-gray-400'}`}>
                          {feature.description.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-2/3 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="p-1 bg-gray-800">
                <div className="flex space-x-2 p-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-6 h-96 flex items-center justify-center">
                <div className={`text-center p-8 rounded-lg bg-gradient-to-br ${features[activeFeature].color} bg-opacity-10 max-w-md`}>
                  <div className="mb-6">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                  <p className="mb-6">{features[activeFeature].description}</p>
                  <Link to={features[activeFeature].link} className="flex items-center mx-auto bg-white text-gray-900 font-medium py-2 px-4 rounded-full hover:bg-gray-100 transition-colors">
                    Try it now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied developers who build with Bolt.new
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Frontend Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "P2.ai has completely transformed my workflow. I can build and deploy applications in a fraction of the time it used to take me."
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-gray-400 text-sm">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The features in P2.ai are incredible. The AI Storyteller has been a game-changer for content creation on our platform."
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">Emily Rodriguez</h4>
                  <p className="text-gray-400 text-sm">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Our team's productivity has skyrocketed since we started using P2.ai. The intuitive interface makes it accessible for everyone on our team."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to supercharge your development?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Join thousands of developers who are building faster and better with Bolt.new
          </p>
          <button onClick={scrollToFeatures} className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-8 h-8 text-purple-500" />
                <span className="text-xl font-bold">P2.ai</span>
              </div>
              <p className="text-gray-400 mb-6">
                Building the future of web development, one application at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Features</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index}>
                    <Link to={feature.link} className="text-gray-400 hover:text-white transition-colors">
                      {feature.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Subscribe to our newsletter</h3>
              <p className="text-gray-400 mb-4">
                Get the latest updates and news directly to your inbox.
              </p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} P2.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;