import { Input } from '@/components/ui/input'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Users, Award, Star, Play, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const navigate = useNavigate();

  // Popular search suggestions
  const searchSuggestions = [
    'React Development',
    'JavaScript Fundamentals',
    'Python Programming',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Node.js',
    'Mobile Development',
    'Digital Marketing',
    'Cybersecurity',
    'Cloud Computing'
  ];

  // Popular categories for quick access
  const popularCategories = [
    { name: 'Web Development', icon: '💻', count: '120+ courses' },
    { name: 'Data Science', icon: '📊', count: '85+ courses' },
    { name: 'Mobile Development', icon: '📱', count: '65+ courses' },
    { name: 'UI/UX Design', icon: '🎨', count: '45+ courses' }
  ];

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/course/search?query=${encodeURIComponent(suggestion)}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/course/search?query=${encodeURIComponent(category)}`);
  };

  const stats = [
    { icon: BookOpen, label: "Courses", value: "500+" },
    { icon: Users, label: "Students", value: "10K+" },
    { icon: Award, label: "Certificates", value: "5K+" },
    { icon: Star, label: "Rating", value: "4.8" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="mb-16 fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 New courses added weekly
            </Badge>
            
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Learn Without
              <span className="block text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Limits
              </span>
            </h1>
            
            <p className="text-white/90 text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Master new skills with expert-led courses. Join thousands of learners advancing their careers.
            </p>

            {/* Search Bar with Suggestions */}
            <div className="max-w-2xl mx-auto mb-8 slide-up relative">
              <form onSubmit={searchHandler}>
                <div className="relative glass-effect rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center">
                    <Search className="absolute left-6 text-gray-400" size={20} />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onFocus={() => searchQuery && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="What do you want to learn today?"
                      className="flex-grow border-none bg-transparent focus-visible:ring-0 pl-14 pr-4 py-4 text-lg text-white placeholder-white/60"
                    />
                    <Button
                      type="submit"
                      className="btn-primary rounded-xl px-8 py-4 text-lg font-semibold"
                    >
                      Search
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (filteredSuggestions.length > 0 || !searchQuery) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                  {searchQuery ? (
                    // Show filtered suggestions when typing
                    <div className="p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                        Suggestions
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                        >
                          <Search size={16} className="text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Show popular categories when no search query
                    <div className="p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                        Popular Categories
                      </div>
                      {popularCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategoryClick(category.name)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                        >
                          <span className="text-xl">{category.icon}</span>
                          <div className="flex-1">
                            <div className="text-gray-900 dark:text-white font-medium">{category.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{category.count}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Popular Search Tags */}
            <div className="mb-8 text-center">
              <p className="text-white/80 text-sm mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['React', 'Python', 'JavaScript', 'Data Science', 'UI/UX', 'Machine Learning'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSuggestionClick(tag)}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-all duration-200 hover:scale-105"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bounce-in">
              <Button 
                onClick={() => navigate('/course/search?query=')} 
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 rounded-xl px-8 py-4 text-lg font-semibold shadow-xl"
              >
                <Play className="mr-2" size={20} />
                Start Learning
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg font-semibold"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
