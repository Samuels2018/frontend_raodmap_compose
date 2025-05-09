interface FlashCardProps {
  card: {
    question: string;
    answer: string;
  };
  flipped: boolean;
  onFlip: () => void;
}

const FlashCard = ({ card, flipped, onFlip }: FlashCardProps) => {
  return (
    <div 
      className={`w-full h-full relative transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
        flipped ? 'rotate-y-180' : ''
      }`}
      onClick={onFlip}
    >
      <div className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col items-center justify-center ${
        !flipped ? 'bg-blue-500 text-white' : 'bg-green-500 text-white rotate-y-180'
      }`}>
        <h3 className="text-xl font-bold mb-4">{!flipped ? 'Pregunta' : 'Respuesta'}</h3>
        <p className="text-lg text-center mb-6">{!flipped ? card.question : card.answer}</p>
        <div className="text-sm opacity-80 mt-auto">
          {!flipped ? 'Haz clic para ver la respuesta' : 'Haz clic para volver a la pregunta'}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;