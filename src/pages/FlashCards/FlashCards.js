import { useState } from 'react';
import FlashCard from './FlashCard';
import ProgressBar from './ProgressBar';

interface FlashCardData {
  id: number;
  question: string;
  answer: string;
}

const initialFlashCards: FlashCardData[] = [
  {
    id: 1,
    question: '¿Qué es React?',
    answer: 'Una biblioteca de JavaScript para construir interfaces de usuario'
  },
  {
    id: 2,
    question: '¿Qué es JSX?',
    answer: 'Una extensión de sintaxis para JavaScript que se parece a HTML'
  },
  {
    id: 3,
    question: '¿Qué es un componente en React?',
    answer: 'Una pieza reutilizable de código que devuelve un elemento React para renderizar'
  },
  {
    id: 4,
    question: '¿Qué es el DOM virtual?',
    answer: 'Una copia ligera del DOM real que React usa para optimizar actualizaciones'
  },
  {
    id: 5,
    question: '¿Qué son los hooks en React?',
    answer: 'Funciones que te permiten usar estado y otras características de React sin escribir clases'
  }
];

const App = () => {
  const [cards] = useState<FlashCardData[]>(initialFlashCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Flash Cards de JavaScript</h1>
        
        <ProgressBar current={currentIndex + 1} total={cards.length} />
        
        <div className="my-6 h-64 perspective-1000">
          <FlashCard 
            card={cards[currentIndex]} 
            flipped={flipped} 
            onFlip={handleFlip} 
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Anterior
          </button>
          <button 
            onClick={handleNext}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;