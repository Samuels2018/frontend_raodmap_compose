import { useState, useRef } from 'react'

const StoriesList = ({ stories, onAddClick, onStoryClick }) => {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="p-4 border-b">
      <div 
        ref={containerRef}
        className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div 
          className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
          onClick={onAddClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-pink-500 p-0.5 cursor-pointer"
            onClick={() => onStoryClick(index)}
          >
            <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={story.image} 
                alt="Story" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoriesList