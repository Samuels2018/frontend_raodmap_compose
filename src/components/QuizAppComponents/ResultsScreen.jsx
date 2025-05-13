const ResultsScreen = ({ score, totalQuestions, userAnswers, onRestart }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quiz Completed!</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-lg text-center">
          Your score: <span className="font-bold">{score}</span> out of <span className="font-bold">{totalQuestions}</span>
        </p>
        <p className="text-center mt-2">
          ({Math.round((score / totalQuestions) * 100)}%)
        </p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Question Breakdown:</h2>
        <div className="space-y-4">
          {userAnswers.map((answer, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <p className="font-medium text-gray-800">{answer.question}</p>
              <p className={`mt-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Your answer: <span className="font-medium">{answer.selectedAnswer || "No answer (time ran out)"}</span>
              </p>
              {!answer.isCorrect && (
                <p className="text-gray-600 mt-1">
                  Correct answer: <span className="font-medium">{answer.correctAnswer}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
      >
        Restart Quiz
      </button>
    </div>
  )
}

export default ResultsScreen