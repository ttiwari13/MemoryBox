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
    memory: { 
      title: "Memory Lane", 
      icon: <Camera className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What season comes after summer?", options: ["Winter", "Fall", "Spring", "Summer"], correct: 1 },
        { question: "Which meal do we eat in the morning?", options: ["Dinner", "Lunch", "Breakfast", "Snack"], correct: 2 },
        { question: "What do we use to write?", options: ["Fork", "Pen", "Spoon", "Cup"], correct: 1 },
        { question: "Where do we sleep?", options: ["Kitchen", "Bed", "Car", "Store"], correct: 1 },
        { question: "What color is the sun?", options: ["Blue", "Yellow", "Green", "Purple"], correct: 1 }
    ]},
    music: { 
      title: "Music Memories", 
      icon: <Music className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "Which instrument has black and white keys?", options: ["Guitar", "Piano", "Drum", "Flute"], correct: 1 },
        { question: "What do singers use their voice for?", options: ["Cooking", "Singing", "Running", "Reading"], correct: 1 },
        { question: "Happy Birthday is sung at...", options: ["Weddings", "Parties", "School", "Work"], correct: 1 },
        { question: "What makes music louder?", options: ["Turning it up", "Whispering", "Closing eyes", "Standing far"], correct: 0 }
    ]},
    daily: { 
      title: "Daily Life", 
      icon: <Home className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What do we brush every day?", options: ["Hair", "Teeth", "Shoes", "Windows"], correct: 1 },
        { question: "When do we say 'Good Morning'?", options: ["Night", "Afternoon", "Morning", "Evening"], correct: 2 },
        { question: "What do we wear on our feet?", options: ["Hat", "Gloves", "Shoes", "Scarf"], correct: 2 },
        { question: "Where do we keep food cold?", options: ["Oven", "Refrigerator", "Closet", "Bed"], correct: 1 }
    ]},
    colors: { 
      title: "Colors & Shapes", 
      icon: <Sparkles className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What color is grass?", options: ["Red", "Green", "Blue", "Yellow"], correct: 1 },
        { question: "What shape is a ball?", options: ["Square", "Triangle", "Round", "Flat"], correct: 2 },
        { question: "What color is snow?", options: ["Black", "White", "Brown", "Pink"], correct: 1 },
        { question: "How many sides does a square have?", options: ["Three", "Four", "Five", "Six"], correct: 1 },
        { question: "What color do you get mixing red and yellow?", options: ["Purple", "Orange", "Green", "Blue"], correct: 1 }
    ]},
    animals: { 
      title: "Animal Friends", 
      icon: <Heart className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What sound does a dog make?", options: ["Meow", "Bark", "Moo", "Chirp"], correct: 1 },
        { question: "What animal gives us milk?", options: ["Cat", "Cow", "Fish", "Bird"], correct: 1 },
        { question: "Which animal flies?", options: ["Dog", "Cat", "Bird", "Fish"], correct: 2 },
        { question: "Where do fish live?", options: ["Trees", "Water", "Sky", "Ground"], correct: 1 },
        { question: "What animal says 'meow'?", options: ["Dog", "Cat", "Horse", "Pig"], correct: 1 }
    ]},
    food: { 
      title: "Food & Kitchen", 
      icon: <Apple className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What do we drink when thirsty?", options: ["Shoes", "Water", "Books", "Clothes"], correct: 1 },
        { question: "What fruit is red and round?", options: ["Banana", "Apple", "Orange", "Grape"], correct: 1 },
        { question: "What do we use to eat soup?", options: ["Fork", "Spoon", "Knife", "Hands"], correct: 1 },
        { question: "Where do we cook food?", options: ["Bedroom", "Kitchen", "Bathroom", "Garden"], correct: 1 },
        { question: "What makes bread?", options: ["Water", "Flour", "Rocks", "Paper"], correct: 1 }
    ]},
    time: { 
      title: "Time & Weather", 
      icon: <Clock className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "When is it dark outside?", options: ["Morning", "Night", "Noon", "Afternoon"], correct: 1 },
        { question: "What comes after Monday?", options: ["Sunday", "Tuesday", "Friday", "Saturday"], correct: 1 },
        { question: "When do flowers bloom?", options: ["Winter", "Spring", "Never", "Always"], correct: 1 },
        { question: "What falls from clouds?", options: ["Cars", "Rain", "Books", "Toys"], correct: 1 },
        { question: "How many days in a week?", options: ["Five", "Seven", "Ten", "Twelve"], correct: 1 }
    ]},
    body: { 
      title: "Body Parts", 
      icon: <CheckCircle className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "What do we see with?", options: ["Ears", "Eyes", "Nose", "Mouth"], correct: 1 },
        { question: "What do we hear with?", options: ["Eyes", "Ears", "Hands", "Feet"], correct: 1 },
        { question: "How many fingers on one hand?", options: ["Three", "Five", "Seven", "Ten"], correct: 1 },
        { question: "What do we smell with?", options: ["Eyes", "Ears", "Nose", "Hair"], correct: 2 },
        { question: "What helps us walk?", options: ["Arms", "Feet", "Head", "Stomach"], correct: 1 }
    ]},
    family: { 
      title: "Family & Friends", 
      icon: <Gift className="w-6 h-6" />, 
      color: "from-primary to-primary", 
      questions: [
        { question: "Who reads bedtime stories?", options: ["Strangers", "Parents", "Nobody", "Cars"], correct: 1 },
        { question: "What do we give on birthdays?", options: ["Nothing", "Gifts", "Problems", "Sadness"], correct: 1 },
        { question: "Who takes care of children?", options: ["Nobody", "Family", "Strangers", "Animals"], correct: 1 },
        { question: "What do families do together?", options: ["Fight", "Love", "Hide", "Run"], correct: 1 },
        { question: "Where do families live?", options: ["Cars", "Home", "Sky", "Water"], correct: 1 }
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
    if (selectedAnswer === null) return "bg-white hover:bg-gray-50 border-gray-300";
    if (index === quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-green-50 border-green-400 text-green-800";
    }
    if (index === selectedAnswer && index !== quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-red-50 border-red-400 text-red-800";
    }
    return "bg-gray-100 text-gray-600 border-gray-300";
  };
  
  const getIcon = (index) => {
    if (selectedAnswer === null) return null;
    if (index === quizzes[currentQuiz].questions[currentQuestion].correct) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (index === selectedAnswer && index !== quizzes[currentQuiz].questions[currentQuestion].correct) {
      return <X className="w-5 h-5 text-red-600" />;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              Memory Games
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Choose a category and start playing to exercise your memory skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(quizzes).map(([key, quiz]) => (
              <button
                key={key}
                onClick={() => handleQuizStart(key)}
                className={`group relative p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r ${quiz.color} text-white`}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    {quiz.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-white/80 text-sm">{quiz.questions.length} questions</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">
              How to Play
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800">Think & Choose</h4>
                <p className="text-slate-600">Read each question carefully and select your answer</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800">Every Try Matters</h4>
                <p className="text-slate-600">Focus on remembering and learning from each question</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-800">Enjoy the Journey</h4>
                <p className="text-slate-600">Take your time and enjoy the memory exercise</p>
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

    const resultMessage = isPerfectScore 
      ? "Excellent! Perfect Score!" 
      : isGoodScore 
      ? "Great Job! Well Done!" 
      : "Good Effort! Keep Practicing!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-10 flex items-center justify-center overflow-y-auto">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center max-w-2xl w-full border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
            {resultMessage}
          </h2>
          
          <div className="bg-blue-50 rounded-xl p-8 mb-8 border border-blue-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Your Score</h3>
            <p className="text-4xl font-bold text-blue-600">
              {score} / {totalQuestions}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(score / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-lg text-slate-600 mb-8">
            {isPerfectScore ? "Outstanding memory skills!" : 
             isGoodScore ? "Your memory is working well!" : 
             "Every question helps strengthen your memory!"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={goBackToQuizSelection}
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-md"
            >
              <Home className="w-5 h-5" />
              Choose Quiz
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={goBackToQuizSelection}
              className="p-2 rounded-full text-slate-600 hover:bg-gray-100 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${quiz.color} text-white`}>
              {quiz.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{quiz.title}</h1>
              <p className="text-slate-600 text-sm">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={handleQuizDropdownToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-slate-700 hover:bg-gray-200 transition-colors"
            >
              Change Quiz
              <ChevronDown className={`w-4 h-4 transition-transform ${showQuizDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showQuizDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {Object.entries(quizzes).map(([key, q]) => (
                  <button
                    key={key}
                    onClick={() => handleQuizChange(key)}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${q.color} text-white`}>
                      {q.icon}
                    </div>
                    <span>{q.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-8">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question & Options */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg text-center border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`flex items-center justify-between p-6 rounded-xl text-lg font-medium border-2 transition-all transform hover:scale-105 disabled:cursor-not-allowed ${getButtonColor(index)}`}
              >
                <span className="flex-1 text-left">{option}</span>
                {getIcon(index)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;