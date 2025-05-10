const StartScreen = ({ onStart }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Quiz App!</h1>
      <p className="text-gray-600 mb-6">
        Test your knowledge with this fun quiz. You'll have 60 seconds to answer each question.
        Correct answers earn you points, while unanswered questions will deduct points.
      </p>
      <button
        onClick={onStart}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default StartScreen;