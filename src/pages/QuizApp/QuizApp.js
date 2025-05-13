import { useState, useEffect } from 'react';
import StartScreen from '../../components/QuizAppComponents/StartScreen';
import QuestionCard from '../../components/QuizAppComponents/QuestionCard';
import ResultsScreen from '../../components/QuizAppComponents/ResultsScreen';

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale"
  },
  {
    question: "Which language is primarily used for web development?",
    options: ["Java", "Python", "JavaScript", "C++"],
    correctAnswer: "JavaScript"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  }
];

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer;
    if (quizStarted && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswerSelected(null);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizFinished, timeLeft]);

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setTimeLeft(60);
  };

  const handleAnswerSelected = (selectedAnswer) => {
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else if (selectedAnswer === null) {
      // Time ran out, decrement score
      setScore(prev => Math.max(0, prev - 1));
    }
    
    setUserAnswers([...userAnswers, {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);
    
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    startQuiz();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {!quizStarted && !quizFinished ? (
          <StartScreen onStart={startQuiz} />
        ) : quizFinished ? (
          <ResultsScreen 
            score={score} 
            totalQuestions={quizData.length} 
            userAnswers={userAnswers}
            onRestart={restartQuiz}
          />
        ) : (
          <QuestionCard 
            question={quizData[currentQuestionIndex].question}
            options={quizData[currentQuestionIndex].options}
            correctAnswer={quizData[currentQuestionIndex].correctAnswer}
            onAnswerSelected={handleAnswerSelected}
            timeLeft={timeLeft}
          />
        )}
      </div>
    </div>
  );
}

export default App;