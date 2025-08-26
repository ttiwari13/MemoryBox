import React, { useState, useRef } from 'react';
import { 
  Star, Heart, Music, Camera, Award, CheckCircle, RotateCcw, Home, 
  Coffee, Flower, Sun, Clock, Car, Book, Apple, Gift, Smile, Frown,
  Sparkles, Leaf, Bone, Lightbulb, Puzzle, X, ArrowLeft, ChevronDown
} from 'lucide-react';

const Quizzes = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizDropdown, setShowQuizDropdown] = useState(false);
  const quizDropdownRef = useRef(null);

  const quizzes = {
    memory: { title: "Memory Lane", icon: <Camera className="w-8 h-8" />, color: "from-blue-400 to-blue-600", questions: [
        { question: "What season comes after summer?", options: ["Winter", "Fall", "Spring", "Summer"], correct: 1, image: "🍂" },
        { question: "Which meal do we eat in the morning?", options: ["Dinner", "Lunch", "Breakfast", "Snack"], correct: 2, image: "🌅" },
        { question: "What do we use to write?", options: ["Fork", "Pen", "Spoon", "Cup"], correct: 1, image: "✏️" },
        { question: "Where do we sleep?", options: ["Kitchen", "Bed", "Car", "Store"], correct: 1, image: "🛏️" },
        { question: "What color is the sun?", options: ["Blue", "Yellow", "Green", "Purple"], correct: 1, image: "☀️" }
    ]},
    music: { title: "Music Memories", icon: <Music className="w-8 h-8" />, color: "from-purple-400 to-purple-600", questions: [
        { question: "Which instrument has black and white keys?", options: ["Guitar", "Piano", "Drum", "Flute"], correct: 1, image: "🎹" },
        { question: "What do singers use their voice for?", options: ["Cooking", "Singing", "Running", "Reading"], correct: 1, image: "🎤" },
        { question: "Happy Birthday is sung at...", options: ["Weddings", "Parties", "School", "Work"], correct: 1, image: "🎂" },
        { question: "What makes music louder?", options: ["Turning it up", "Whispering", "Closing eyes", "Standing far"], correct: 0, image: "🔊" }
    ]},
    daily: { title: "Daily Life", icon: <Home className="w-8 h-8" />, color: "from-green-400 to-green-600", questions: [
        { question: "What do we brush every day?", options: ["Hair", "Teeth", "Shoes", "Windows"], correct: 1, image: "🦷" },
        { question: "When do we say 'Good Morning'?", options: ["Night", "Afternoon", "Morning", "Evening"], correct: 2, image: "☀️" },
        { question: "What do we wear on our feet?", options: ["Hat", "Gloves", "Shoes", "Scarf"], correct: 2, image: "👟" },
        { question: "Where do we keep food cold?", options: ["Oven", "Refrigerator", "Closet", "Bed"], correct: 1, image: "🧊" }
    ]},
    colors: { title: "Colors & Shapes", icon: <Sun className="w-8 h-8" />, color: "from-yellow-400 to-yellow-600", questions: [
        { question: "What color is grass?", options: ["Red", "Green", "Blue", "Yellow"], correct: 1, image: "🌱" },
        { question: "What shape is a ball?", options: ["Square", "Triangle", "Round", "Flat"], correct: 2, image: "⚽" },
        { question: "What color is snow?", options: ["Black", "White", "Brown", "Pink"], correct: 1, image: "❄️" },
        { question: "How many sides does a square have?", options: ["Three", "Four", "Five", "Six"], correct: 1, image: "⬜" },
        { question: "What color do you get mixing red and yellow?", options: ["Purple", "Orange", "Green", "Blue"], correct: 1, image: "🎨" }
    ]},
    animals: { title: "Animal Friends", icon: <Heart className="w-8 h-8" />, color: "from-pink-400 to-pink-600", questions: [
        { question: "What sound does a dog make?", options: ["Meow", "Bark", "Moo", "Chirp"], correct: 1, image: "🐕" },
        { question: "What animal gives us milk?", options: ["Cat", "Cow", "Fish", "Bird"], correct: 1, image: "🐄" },
        { question: "Which animal flies?", options: ["Dog", "Cat", "Bird", "Fish"], correct: 2, image: "🐦" },
        { question: "Where do fish live?", options: ["Trees", "Water", "Sky", "Ground"], correct: 1, image: "🐟" },
        { question: "What animal says 'meow'?", options: ["Dog", "Cat", "Horse", "Pig"], correct: 1, image: "🐱" }
    ]},
    food: { title: "Food & Kitchen", icon: <Apple className="w-8 h-8" />, color: "from-orange-400 to-orange-600", questions: [
        { question: "What do we drink when thirsty?", options: ["Shoes", "Water", "Books", "Clothes"], correct: 1, image: "💧" },
        { question: "What fruit is red and round?", options: ["Banana", "Apple", "Orange", "Grape"], correct: 1, image: "🍎" },
        { question: "What do we use to eat soup?", options: ["Fork", "Spoon", "Knife", "Hands"], correct: 1, image: "🥄" },
        { question: "Where do we cook food?", options: ["Bedroom", "Kitchen", "Bathroom", "Garden"], correct: 1, image: "👩‍🍳" },
        { question: "What makes bread?", options: ["Water", "Flour", "Rocks", "Paper"], correct: 1, image: "🍞" }
    ]},
    time: { title: "Time & Weather", icon: <Clock className="w-8 h-8" />, color: "from-cyan-400 to-cyan-600", questions: [
        { question: "When is it dark outside?", options: ["Morning", "Night", "Noon", "Afternoon"], correct: 1, image: "🌙" },
        { question: "What comes after Monday?", options: ["Sunday", "Tuesday", "Friday", "Saturday"], correct: 1, image: "📅" },
        { question: "When do flowers bloom?", options: ["Winter", "Spring", "Never", "Always"], correct: 1, image: "🌸" },
        { question: "What falls from clouds?", options: ["Cars", "Rain", "Books", "Toys"], correct: 1, image: "🌧️" },
        { question: "How many days in a week?", options: ["Five", "Seven", "Ten", "Twelve"], correct: 1, image: "📆" }
    ]},
    body: { title: "Body Parts", icon: <CheckCircle className="w-8 h-8" />, color: "from-red-400 to-red-600", questions: [
        { question: "What do we see with?", options: ["Ears", "Eyes", "Nose", "Mouth"], correct: 1, image: "👀" },
        { question: "What do we hear with?", options: ["Eyes", "Ears", "Hands", "Feet"], correct: 1, image: "👂" },
        { question: "How many fingers on one hand?", options: ["Three", "Five", "Seven", "Ten"], correct: 1, image: "✋" },
        { question: "What do we smell with?", options: ["Eyes", "Ears", "Nose", "Hair"], correct: 2, image: "👃" },
        { question: "What helps us walk?", options: ["Arms", "Feet", "Head", "Stomach"], correct: 1, image: "🦶" }
    ]},
    family: { title: "Family & Friends", icon: <Gift className="w-8 h-8" />, color: "from-teal-400 to-teal-600", questions: [
        { question: "Who reads bedtime stories?", options: ["Strangers", "Parents", "Nobody", "Cars"], correct: 1, image: "📚" },
        { question: "What do we give on birthdays?", options: ["Nothing", "Gifts", "Problems", "Sadness"], correct: 1, image: "🎁" },
        { question: "Who takes care of children?", options: ["Nobody", "Family", "Strangers", "Animals"], correct: 1, image: "👨‍👩‍👧‍👦" },
        { question: "What do families do together?", options: ["Fight", "Love", "Hide", "Run"], correct: 1, image: "❤️" },
        { question: "Where do families live?", options: ["Cars", "Home", "Sky", "Water"], correct: 1, image: "🏠" }
    ]}
  };

  const handleQuizStart = (quizKey) => {
    setCurrentQuiz(quizKey);
    resetQuiz();
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizzes[currentQuiz].questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < quizzes[currentQuiz].questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const goBackToQuizSelection = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const getButtonColor = (index) => {
    if (selectedAnswer === null) return "bg-white hover:bg-gray-100";
    if (index === quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-green-300 border-green-500 text-green-900";
    }
    if (index === selectedAnswer && index !== quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-red-300 border-red-500 text-red-900";
    }
    return "bg-gray-200 text-gray-700";
  };
  
  const getIcon = (index) => {
    if (selectedAnswer === null) return null;
    if (index === quizzes[currentQuiz].questions[currentQuestion].correct) {
      return <CheckCircle className="w-5 h-5 text-green-700" />;
    }
    if (index === selectedAnswer && index !== quizzes[currentQuiz].questions[currentQuestion].correct) {
      return <X className="w-5 h-5 text-red-700" />;
    }
    return null;
  };
  
  const handleQuizDropdownToggle = () => {
    setShowQuizDropdown(!showQuizDropdown);
  };
  
  const handleQuizChange = (quizKey) => {
    handleQuizStart(quizKey);
    setShowQuizDropdown(false);
  };

  // Quiz selection screen
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 sm:mb-8 text-gray-800">
            🧠 Memory Games
          </h1>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-lg">
            Choose a category and start playing!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(quizzes).map(([key, quiz]) => (
              <button
                key={key}
                onClick={() => handleQuizStart(key)}
                className={`p-6 sm:p-8 rounded-2xl shadow-lg border-b-4 border-gray-300 hover:shadow-xl transition-all hover:scale-105 group bg-gradient-to-r ${quiz.color}`}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-white/30 p-4 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-white shadow-inner">
                    {quiz.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{quiz.title}</h2>
                  <p className="text-white/80 text-sm">{quiz.questions.length} questions</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-200">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800">
              💡 How to Play
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl mb-3 bg-blue-100 p-3 rounded-full">👆</div>
                <h4 className="text-lg sm:text-xl font-semibold mb-1">Tap to Answer</h4>
                <p className="text-gray-600 text-sm">Choose the answer you think is right.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl mb-3 bg-yellow-100 p-3 rounded-full">⭐</div>
                <h4 className="text-lg sm:text-xl font-semibold mb-1">Every Try Counts</h4>
                <p className="text-gray-600 text-sm">It's about having fun and remembering!</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl mb-3 bg-pink-100 p-3 rounded-full">🎉</div>
                <h4 className="text-lg sm:text-xl font-semibold mb-1">Have Fun</h4>
                <p className="text-gray-600 text-sm">Enjoy the journey together.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const totalQuestions = quizzes[currentQuiz].questions.length;
    const isPerfectScore = score === totalQuestions;
    const isGoodScore = score >= totalQuestions / 2;

    const resultEmoji = isPerfectScore ? "🎉" : isGoodScore ? "✨" : "😊";
    const resultMessage = isPerfectScore 
      ? "You're a superstar! A perfect score!" 
      : isGoodScore 
      ? "Great job! You did fantastic." 
      : "You did wonderful! Keep practicing!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-6 sm:p-10 flex items-center justify-center overflow-y-auto">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center max-w-2xl w-full border border-gray-200">
          <div className="text-5xl sm:text-6xl mb-6">{resultEmoji}</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
            {resultMessage}
          </h2>
          
          <div className="bg-blue-100 rounded-xl p-6 sm:p-8 mb-8 sm:mb-10 shadow-inner">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Score</h3>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {score} out of {totalQuestions}
            </p>
          </div>

          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10">
            Every answer is a wonderful sign of your memory. 🌟
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
            <button
              onClick={goBackToQuizSelection}
              className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl text-lg border-2 border-indigo-600 hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-md"
            >
              <Home className="w-5 h-5" />
              Choose New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz playing screen
  const quiz = quizzes[currentQuiz];
  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={goBackToQuizSelection}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600 text-sm">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={handleQuizDropdownToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Change Quiz
              <ChevronDown className={`w-4 h-4 transition-transform ${showQuizDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showQuizDropdown && (
              <div 
                ref={quizDropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20"
              >
                {Object.entries(quizzes).map(([key, q]) => (
                  <button
                    key={key}
                    onClick={() => handleQuizChange(key)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {q.icon && <div className={`w-6 h-6 ${q.color.replace('from-', 'bg-').split(' ')[0]} rounded-full flex items-center justify-center text-white`}>{q.icon}</div>}
                    <span className="truncate">{q.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question & Options */}
        <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-lg text-center border border-gray-200">
          <div className="text-6xl sm:text-8xl mb-6">{question.image}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-10">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`flex items-center justify-center gap-2 p-4 sm:p-6 rounded-xl text-lg sm:text-xl font-semibold border-2 transition-all transform hover:scale-105 disabled:cursor-not-allowed ${getButtonColor(index)}`}
              >
                {option}
                {selectedAnswer !== null && getIcon(index)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;