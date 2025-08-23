import React, { useState } from 'react';
import { Star, Heart, Music, Camera, Award, CheckCircle, RotateCcw, Home, Coffee, Flower, Sun, Clock, Car, Book, Apple, Gift } from 'lucide-react';

const Quizzes = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const quizzes = {
    memory: {
      title: "Memory Lane",
      icon: <Camera className="w-6 h-6" />,
      questions: [
        {
          question: "What season comes after summer?",
          options: ["Winter", "Fall", "Spring", "Summer"],
          correct: 1,
          image: "🍂"
        },
        {
          question: "Which meal do we eat in the morning?",
          options: ["Dinner", "Lunch", "Breakfast", "Snack"],
          correct: 2,
          image: "🌅"
        },
        {
          question: "What do we use to write?",
          options: ["Fork", "Pen", "Spoon", "Cup"],
          correct: 1,
          image: "✏️"
        },
        {
          question: "Where do we sleep?",
          options: ["Kitchen", "Bed", "Car", "Store"],
          correct: 1,
          image: "🛏️"
        },
        {
          question: "What color is the sun?",
          options: ["Blue", "Yellow", "Green", "Purple"],
          correct: 1,
          image: "☀️"
        }
      ]
    },
    music: {
      title: "Music Memories",
      icon: <Music className="w-6 h-6" />,
      questions: [
        {
          question: "Which instrument has black and white keys?",
          options: ["Guitar", "Piano", "Drum", "Flute"],
          correct: 1,
          image: "🎹"
        },
        {
          question: "What do singers use their voice for?",
          options: ["Cooking", "Singing", "Running", "Reading"],
          correct: 1,
          image: "🎤"
        },
        {
          question: "Happy Birthday is sung at...",
          options: ["Weddings", "Parties", "School", "Work"],
          correct: 1,
          image: "🎂"
        },
        {
          question: "What makes music louder?",
          options: ["Turning it up", "Whispering", "Closing eyes", "Standing far"],
          correct: 0,
          image: "🔊"
        }
      ]
    },
    daily: {
      title: "Daily Life",
      icon: <Home className="w-6 h-6" />,
      questions: [
        {
          question: "What do we brush every day?",
          options: ["Hair", "Teeth", "Shoes", "Windows"],
          correct: 1,
          image: "🦷"
        },
        {
          question: "When do we say 'Good Morning'?",
          options: ["Night", "Afternoon", "Morning", "Evening"],
          correct: 2,
          image: "☀️"
        },
        {
          question: "What do we wear on our feet?",
          options: ["Hat", "Gloves", "Shoes", "Scarf"],
          correct: 2,
          image: "👟"
        },
        {
          question: "Where do we keep food cold?",
          options: ["Oven", "Refrigerator", "Closet", "Bed"],
          correct: 1,
          image: "🧊"
        }
      ]
    },
    colors: {
      title: "Colors & Shapes",
      icon: <Sun className="w-6 h-6" />,
      questions: [
        {
          question: "What color is grass?",
          options: ["Red", "Green", "Blue", "Yellow"],
          correct: 1,
          image: "🌱"
        },
        {
          question: "What shape is a ball?",
          options: ["Square", "Triangle", "Round", "Flat"],
          correct: 2,
          image: "⚽"
        },
        {
          question: "What color is snow?",
          options: ["Black", "White", "Brown", "Pink"],
          correct: 1,
          image: "❄️"
        },
        {
          question: "How many sides does a square have?",
          options: ["Three", "Four", "Five", "Six"],
          correct: 1,
          image: "⬜"
        },
        {
          question: "What color do you get mixing red and yellow?",
          options: ["Purple", "Orange", "Green", "Blue"],
          correct: 1,
          image: "🎨"
        }
      ]
    },
    animals: {
      title: "Animal Friends",
      icon: <Heart className="w-6 h-6" />,
      questions: [
        {
          question: "What sound does a dog make?",
          options: ["Meow", "Bark", "Moo", "Chirp"],
          correct: 1,
          image: "🐕"
        },
        {
          question: "What animal gives us milk?",
          options: ["Cat", "Cow", "Fish", "Bird"],
          correct: 1,
          image: "🐄"
        },
        {
          question: "Which animal flies?",
          options: ["Dog", "Cat", "Bird", "Fish"],
          correct: 2,
          image: "🐦"
        },
        {
          question: "Where do fish live?",
          options: ["Trees", "Water", "Sky", "Ground"],
          correct: 1,
          image: "🐟"
        },
        {
          question: "What animal says 'meow'?",
          options: ["Dog", "Cat", "Horse", "Pig"],
          correct: 1,
          image: "🐱"
        }
      ]
    },
    food: {
      title: "Food & Kitchen",
      icon: <Apple className="w-6 h-6" />,
      questions: [
        {
          question: "What do we drink when thirsty?",
          options: ["Shoes", "Water", "Books", "Clothes"],
          correct: 1,
          image: "💧"
        },
        {
          question: "What fruit is red and round?",
          options: ["Banana", "Apple", "Orange", "Grape"],
          correct: 1,
          image: "🍎"
        },
        {
          question: "What do we use to eat soup?",
          options: ["Fork", "Spoon", "Knife", "Hands"],
          correct: 1,
          image: "🥄"
        },
        {
          question: "Where do we cook food?",
          options: ["Bedroom", "Kitchen", "Bathroom", "Garden"],
          correct: 1,
          image: "👩‍🍳"
        },
        {
          question: "What makes bread?",
          options: ["Water", "Flour", "Rocks", "Paper"],
          correct: 1,
          image: "🍞"
        }
      ]
    },
    time: {
      title: "Time & Weather",
      icon: <Clock className="w-6 h-6" />,
      questions: [
        {
          question: "When is it dark outside?",
          options: ["Morning", "Night", "Noon", "Afternoon"],
          correct: 1,
          image: "🌙"
        },
        {
          question: "What comes after Monday?",
          options: ["Sunday", "Tuesday", "Friday", "Saturday"],
          correct: 1,
          image: "📅"
        },
        {
          question: "When do flowers bloom?",
          options: ["Winter", "Spring", "Never", "Always"],
          correct: 1,
          image: "🌸"
        },
        {
          question: "What falls from clouds?",
          options: ["Cars", "Rain", "Books", "Toys"],
          correct: 1,
          image: "🌧️"
        },
        {
          question: "How many days in a week?",
          options: ["Five", "Seven", "Ten", "Twelve"],
          correct: 1,
          image: "📆"
        }
      ]
    },
    body: {
      title: "Body Parts",
      icon: <CheckCircle className="w-6 h-6" />,
      questions: [
        {
          question: "What do we see with?",
          options: ["Ears", "Eyes", "Nose", "Mouth"],
          correct: 1,
          image: "👀"
        },
        {
          question: "What do we hear with?",
          options: ["Eyes", "Ears", "Hands", "Feet"],
          correct: 1,
          image: "👂"
        },
        {
          question: "How many fingers on one hand?",
          options: ["Three", "Five", "Seven", "Ten"],
          correct: 1,
          image: "✋"
        },
        {
          question: "What do we smell with?",
          options: ["Eyes", "Ears", "Nose", "Hair"],
          correct: 2,
          image: "👃"
        },
        {
          question: "What helps us walk?",
          options: ["Arms", "Feet", "Head", "Stomach"],
          correct: 1,
          image: "🦶"
        }
      ]
    },
    family: {
      title: "Family & Friends",
      icon: <Gift className="w-6 h-6" />,
      questions: [
        {
          question: "Who reads bedtime stories?",
          options: ["Strangers", "Parents", "Nobody", "Cars"],
          correct: 1,
          image: "📚"
        },
        {
          question: "What do we give on birthdays?",
          options: ["Nothing", "Gifts", "Problems", "Sadness"],
          correct: 1,
          image: "🎁"
        },
        {
          question: "Who takes care of children?",
          options: ["Nobody", "Family", "Strangers", "Animals"],
          correct: 1,
          image: "👨‍👩‍👧‍👦"
        },
        {
          question: "What do families do together?",
          options: ["Fight", "Love", "Hide", "Run"],
          correct: 1,
          image: "❤️"
        },
        {
          question: "Where do families live?",
          options: ["Cars", "Home", "Sky", "Water"],
          correct: 1,
          image: "🏠"
        }
      ]
    }
  };

  const handleAnswerSelect = (answerIndex) => {
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
    if (selectedAnswer === null) return "bg-blue-100 hover:bg-blue-200";
    if (index === quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-green-200";
    }
    if (index === selectedAnswer && index !== quizzes[currentQuiz].questions[currentQuestion].correct) {
      return "bg-red-200";
    }
    return "bg-gray-200";
  };

  // Quiz selection screen
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            🧠 Memory Games for Alzheimer's Patients
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(quizzes).map(([key, quiz]) => (
              <button
                key={key}
                onClick={() => setCurrentQuiz(key)}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all hover:scale-105 group"
              >
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    {quiz.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
                  <p className="text-gray-600 mb-4">{quiz.questions.length} questions</p>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Start Quiz
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              🎯 How to Play
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-4xl mb-3">👆</div>
                <h4 className="text-lg font-semibold mb-2">Tap to Answer</h4>
                <p className="text-gray-600">Choose the answer that feels right</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-3">⭐</div>
                <h4 className="text-lg font-semibold mb-2">Every Try Counts</h4>
                <p className="text-gray-600">All answers are celebrated</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-3">🎉</div>
                <h4 className="text-lg font-semibold mb-2">Have Fun</h4>
                <p className="text-gray-600">Enjoy the memories together</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-12 shadow-xl text-center max-w-2xl w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Wonderful Job!
          </h2>
          
          <div className="bg-yellow-100 rounded-xl p-6 mb-8">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Score</h3>
            <p className="text-3xl font-bold text-blue-600">
              {score} out of {quizzes[currentQuiz].questions.length}
            </p>
          </div>

          <p className="text-xl text-gray-600 mb-8">
            You did amazing! Every answer shows your wonderful memory. 🌟
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
            <button
              onClick={goBackToQuizSelection}
              className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                {quiz.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>
            <button
              onClick={goBackToQuizSelection}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              title="Back to Quiz Selection"
            >
              <Home className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <div className="text-8xl mb-6">{question.image}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            {question.question}
          </h2>

          {/* Answer options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-xl text-xl font-semibold border-2 transition-all transform hover:scale-105 disabled:cursor-not-allowed ${getButtonColor(index)}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;