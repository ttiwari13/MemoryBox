import React, { useState } from 'react';
import { Check, X, Upload, Trash2, Plus } from 'lucide-react';

// Photo Upload Component
const PhotoUploader = ({ onPhotoAdd }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file!');
    }
  };

  const handleAddPhoto = () => {
    if (!selectedFile || !correctAnswer.trim()) {
      alert('Please select a photo and enter the correct answer!');
      return;
    }

    setIsUploading(true);
    
    // Convert file to URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoData = {
        imageUrl: e.target.result,
        correctAnswer: correctAnswer.toLowerCase().trim(),
        fileName: selectedFile.name
      };
      
      onPhotoAdd(photoData);
      
      // Reset form
      setSelectedFile(null);
      setCorrectAnswer('');
      setIsUploading(false);
      
      // Reset file input
      document.getElementById('photo-input').value = '';
    };
    
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <div className="text-center mb-4">
        <Upload className="mx-auto text-gray-400 mb-2" size={48} />
        <h3 className="text-xl font-bold text-gray-700">Upload New Photo</h3>
      </div>
      
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Photo:
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Preview */}
        {selectedFile && (
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Preview:</div>
            <div className="w-32 h-32 mx-auto overflow-hidden rounded-lg border">
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Correct Answer Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer:
          </label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter what this photo shows..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Add Button */}
        <button
          onClick={handleAddPhoto}
          disabled={!selectedFile || !correctAnswer.trim() || isUploading}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            selectedFile && correctAnswer.trim() && !isUploading
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? 'Adding...' : 'Add Photo'}
        </button>
      </div>
    </div>
  );
};

// Photo Learning Component
const PhotoEntry = ({ 
  imageUrl, 
  correctAnswer, 
  onTextChange, 
  textValue, 
  feedback, 
  index,
  onDelete,
  fileName
}) => {
  const getFeedbackColor = () => {
    if (feedback === 'correct') return 'border-green-500 bg-green-50';
    if (feedback === 'incorrect') return 'border-red-500 bg-red-50';
    return 'border-gray-300 bg-white';
  };

  const getFeedbackIcon = () => {
    if (feedback === 'correct') return <Check className="text-green-500" size={20} />;
    if (feedback === 'incorrect') return <X className="text-red-500" size={20} />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
      {/* Delete Button */}
      <button
        onClick={() => onDelete(index)}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
        title="Delete this photo"
      >
        <Trash2 size={16} />
      </button>
      
      {/* Photo */}
      <div className="w-full h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={imageUrl}
          alt={fileName || `Photo ${index + 1}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* File Name */}
      {fileName && (
        <div className="text-xs text-gray-500 mb-2 truncate" title={fileName}>
          📁 {fileName}
        </div>
      )}
      
      {/* Correct Answer Display */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <span className="text-sm text-blue-600">Correct Answer:</span>
          <div className="text-xl font-bold text-blue-800 mt-1 capitalize">{correctAnswer}</div>
        </div>
      </div>
      
      {/* Text Input */}
      <div className="relative">
        <input
          type="text"
          className={`w-full p-4 pr-12 text-lg border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 ${getFeedbackColor()}`}
          placeholder="Type what you see..."
          value={textValue}
          onChange={onTextChange}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {getFeedbackIcon()}
        </div>
      </div>
      
      {/* Feedback Message */}
      {feedback && (
        <div className={`mt-3 p-3 rounded-lg text-center font-medium ${
          feedback === 'correct' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {feedback === 'correct' ? '🎉 Perfect! You got it right!' : '❌ Not quite right, try again!'}
        </div>
      )}
    </div>
  );
};

const ContactContent = () => {
  const [photos, setPhotos] = useState([]);
  const [messages, setMessages] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showUploader, setShowUploader] = useState(true);

  const handlePhotoAdd = (photoData) => {
    setPhotos(prev => [...prev, photoData]);
    console.log('Photo added:', photoData.fileName);
  };

  const handlePhotoDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      setPhotos(prev => prev.filter((_, i) => i !== index));
      
      // Clean up related state
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[index];
        // Reindex remaining messages
        const reindexed = {};
        Object.keys(newMessages).forEach(key => {
          const oldIndex = parseInt(key);
          if (oldIndex > index) {
            reindexed[oldIndex - 1] = newMessages[key];
          } else {
            reindexed[key] = newMessages[key];
          }
        });
        return reindexed;
      });
      
      setFeedback(prev => {
        const newFeedback = { ...prev };
        delete newFeedback[index];
        // Reindex remaining feedback
        const reindexed = {};
        Object.keys(newFeedback).forEach(key => {
          const oldIndex = parseInt(key);
          if (oldIndex > index) {
            reindexed[oldIndex - 1] = newFeedback[key];
          } else {
            reindexed[key] = newFeedback[key];
          }
        });
        return reindexed;
      });
    }
  };

  const validateAnswer = (index, userAnswer) => {
    const correctAnswer = photos[index].correctAnswer.toLowerCase();
    const userInput = userAnswer.toLowerCase().trim();
    
    const isCorrect = userInput === correctAnswer || 
                     userInput.includes(correctAnswer) || 
                     correctAnswer.includes(userInput);
    
    setFeedback(prev => ({
      ...prev,
      [index]: isCorrect ? 'correct' : 'incorrect'
    }));
    
    setTimeout(() => {
      setFeedback(prev => ({
        ...prev,
        [index]: null
      }));
    }, 3000);
  };

  const handleTextChange = (index, e) => {
    const value = e.target.value;
    setMessages(prev => ({
      ...prev,
      [index]: value
    }));
    
    if (value.trim().length > 0) {
      validateAnswer(index, value);
    }
  };

  const getScore = () => {
    const correctAnswers = Object.values(feedback).filter(f => f === 'correct').length;
    return correctAnswers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📸 Your Photo Memory Game
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Upload your own photos and create a personalized learning experience!
          </p>
          {photos.length > 0 && (
            <div className="bg-white rounded-full px-6 py-3 inline-block shadow-md mr-4">
              <span className="text-lg font-semibold text-gray-700">
                Score: {getScore()} / {photos.length}
              </span>
            </div>
          )}
          <div className="bg-white rounded-full px-6 py-3 inline-block shadow-md">
            <span className="text-lg font-semibold text-gray-700">
              Total Photos: {photos.length}
            </span>
          </div>
        </div>
        
        {/* Upload Section */}
        {showUploader && (
          <div className="mb-8">
            <PhotoUploader onPhotoAdd={handlePhotoAdd} />
          </div>
        )}
        
        {/* Toggle Uploader Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto space-x-2"
          >
            <Plus size={20} />
            <span>{showUploader ? 'Hide' : 'Show'} Photo Uploader</span>
          </button>
        </div>

        {/* Instructions */}
        {photos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 How to Play</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">👀</div>
                <div className="font-semibold text-blue-800">Step 1</div>
                <div className="text-blue-600">Look at your photo</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">⌨️</div>
                <div className="font-semibold text-green-800">Step 2</div>
                <div className="text-green-600">Type what you see</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold text-purple-800">Step 3</div>
                <div className="text-purple-600">Get instant feedback</div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => (
              <PhotoEntry
                key={`${photo.fileName}-${index}`}
                index={index}
                imageUrl={photo.imageUrl}
                correctAnswer={photo.correctAnswer}
                fileName={photo.fileName}
                onTextChange={(e) => handleTextChange(index, e)}
                textValue={messages[index] || ''}
                feedback={feedback[index]}
                onDelete={handlePhotoDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Photos Yet</h3>
            <p className="text-gray-500">Upload your first photo to start learning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactContent;