import { useState, useEffect } from 'react';
import { Users, Globe2, Gamepad2, Building2, ArrowRight, Share2, Sparkles, UserPlus, LogIn, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDarkMode);
    }
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                Nexora
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? 
                  <Sun className="w-5 h-5 text-yellow-400" /> : 
                  <Moon className="w-5 h-5 text-blue-600" />
                }
              </button>
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-700 dark:text-gray-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign up</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/30 to-blue-400/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 dark:from-blue-900/30 dark:to-blue-800/30"
          style={{
            transform: `translate(-50%, ${-50 + scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative">
          <div 
            className="mb-8"
            style={{
              transform: `translateY(${-scrollY * 0.2}px)`,
              opacity: 1 - (scrollY * 0.001)
            }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Your Virtual World <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the next generation of virtual interaction. Connect, create, and collaborate
              in immersive 3D spaces designed for the future of digital engagement.
            </p>
          </div>
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              transform: `translateY(${-scrollY * 0.1}px)`
            }}
          >
            <button className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center space-x-2 border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm">
              <span className="text-gray-900 dark:text-white">Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent dark:via-blue-900/5"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Nexora?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Social Interaction",
                description: "Connect with friends and colleagues in realistic virtual environments that make remote interactions feel natural and engaging."
              },
              {
                icon: Building2,
                title: "Custom Spaces",
                description: "Create and customize your own virtual spaces for meetings, events, or casual hangouts with our intuitive building tools."
              },
              {
                icon: Share2,
                title: "Seamless Integration",
                description: "Share screens, documents, and media effortlessly within your virtual space, making collaboration smooth and efficient."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-xl bg-white dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - 400) * 0.1)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 300) * 0.002)),
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 dark:from-blue-900/20 dark:to-blue-800/20"
          style={{
            transform: `translateY(${(scrollY - 800) * 0.1}px)`
          }}
        />
        <div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl dark:bg-blue-900/30"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl dark:bg-blue-800/30"
          style={{
            transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.05}px)`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 relative">
              Ready to Step Into the Future?
              <Sparkles className="absolute -right-12 top-0 w-8 h-8 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already exploring and connecting in our virtual spaces.
              Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                <Gamepad2 className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                <span>Create Your Space</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
