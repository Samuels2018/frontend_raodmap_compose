import { useState } from 'react';

const QuestionCard = ({ question, options, correctAnswer, onAnswerSelected, timeLeft }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswerClick = (answer) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
    
    setTimeout(() => {
      onAnswerSelected(answer);
      setSelectedAnswer(null);
      setHasAnswered(false);
    }, 1500);
  };

  const getButtonClass = (option) => {
    if (!hasAnswered) return "bg-white hover:bg-gray-100 text-gray-800";
    
    if (option === correctAnswer) {
      return "bg-green-500 text-white";
    }
    
    if (option === selectedAnswer && option !== correctAnswer) {
      return "bg-red-500 text-white";
    }
    
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-gray-600">Question {timeLeft > 0 ? timeLeft : "Time's up!"}</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">{question}</h2>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            className={`w-full text-left py-3 px-4 rounded-lg border border-gray-300 transition duration-200 ${getButtonClass(option)}`}
            disabled={hasAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      
      {hasAnswered && (
        <div className={`mt-4 p-3 rounded-lg ${selectedAnswer === correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {selectedAnswer === correctAnswer ? (
            <p>Correct! Well done.</p>
          ) : (
            <p>The correct answer is: <span className="font-bold">{correctAnswer}</span></p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;