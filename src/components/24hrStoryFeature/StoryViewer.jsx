import { useState, useEffect } from 'react'

const StoryViewer = ({ story, onClose, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!story || isPaused) return

    const duration = 5000 // 5 seconds per story
    const interval = 50 // update progress every 50ms
    const increment = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          onNext()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [story, isPaused, onNext])

  const handleTouchStart = (e) => {
    const touchX = e.touches[0].clientX
    const screenWidth = window.innerWidth
    
    // Pause story when touching
    setIsPaused(true)
    
    // Store touch position for swipe detection
    e.target.dataset.touchX = touchX
    e.target.dataset.screenWidth = screenWidth
  }

  const handleTouchEnd = (e) => {
    const touchX = parseFloat(e.target.dataset.touchX)
    const screenWidth = parseFloat(e.target.dataset.screenWidth)
    const endX = e.changedTouches[0].clientX
    const diff = endX - touchX
    
    // If swipe is more than 20% of screen width, navigate
    if (Math.abs(diff) > screenWidth * 0.2) {
      if (diff > 0) {
        onPrev()
      } else {
        onNext()
      }
    }
    
    // Resume playback
    setIsPaused(false)
  }

  if (!story) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-10">
        <div 
          className="h-full bg-white" 
          style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
        ></div>
      </div>
      
      <div 
        className="flex-1 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={story.image} 
          alt="Story" 
          className="w-full h-full object-contain"
        />
        
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 flex">
        <div className="flex-1" onClick={onPrev}></div>
        <div className="flex-1" onClick={onNext}></div>
      </div>
    </div>
  )
}

export default StoryViewer