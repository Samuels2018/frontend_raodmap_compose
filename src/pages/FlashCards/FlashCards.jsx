import { useState } from 'react'
import FlashCard from '../../components/FlashCardsComponents/FlashCard'
import ProgressBar from '../../components/FlashCardsComponents/ProgressBar'

const initialFlashCards = [
  {
    id: 1,
    question: "¿Cuál es el idioma más hablado del mundo?",
    answer: "El chino mandarín con aproximadamente 1.100 millones de hablantes"
  },
  {
    id: 2,
    question: "¿Qué significa 'lengua romance'?",
    answer: "Son idiomas que derivan del latín vulgar, como el español, francés, italiano, portugués y rumano"
  },
  {
    id: 3,
    question: "¿Qué es un cognado en lingüística?",
    answer: "Palabras en diferentes idiomas que comparten origen y significado similar (ej: 'nation' en inglés y 'nación' en español)"
  },
  {
    id: 4,
    question: "¿Qué es el CEFR en el aprendizaje de idiomas?",
    answer: "Marco Común Europeo de Referencia para las lenguas, un estándar para medir el nivel de competencia lingüística (A1-C2)"
  },
  {
    id: 5,
    question: "¿Qué ventaja tiene aprender idiomas desde niño?",
    answer: "Los niños adquieren mejor la pronunciación nativa y desarrollan mayor plasticidad cerebral para el lenguaje"
  },
  {
    id: 6,
    question: "¿Qué es la inmersión lingüística?",
    answer: "Método de aprendizaje donde el estudiante se rodea completamente del idioma objetivo en situaciones reales"
  },
  {
    id: 7,
    question: "¿Qué idioma es más útil para negocios internacionales?",
    answer: "El inglés sigue siendo el idioma dominante en negocios, seguido por el chino mandarín y el español"
  },
  {
    id: 8,
    question: "¿Qué es un idioma tonal?",
    answer: "Idioma donde el tono con que se pronuncia una sílaba cambia su significado (ej: chino mandarín, tailandés)"
  },
  {
    id: 9,
    question: "¿Cuánto tiempo toma aprender un idioma?",
    answer: "Depende del idioma y del estudiante, pero el FSI estima 600-750 horas para idiomas similares al materno"
  },
  {
    id: 10,
    question: "¿Qué es el efecto de lengua puente?",
    answer: "Cuando aprender un segundo idioma facilita aprender un tercero, especialmente si son de la misma familia lingüística"
  }
]

const FlashCardsPage = () => {
  const [cards] = useState(initialFlashCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => 
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrev = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    )
  }

  const handleFlip = () => {
    setFlipped(!flipped)
  }

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
  )
}

export default FlashCardsPage