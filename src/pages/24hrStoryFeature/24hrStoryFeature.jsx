import { useState, useEffect } from 'react'
import StoriesList from '../../components/24hrStoryFeature/StoriesList'
import StoryViewer from '../../components/24hrStoryFeature/StoryViewer'
import CreateStory from '../../components/24hrStoryFeature/CreateStory'

const StoryFeature = () => {
  const [stories, setStories] = useState([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Load stories from localStorage on component mount
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('stories')) || []
    // Filter out expired stories
    const validStories = savedStories.filter(story => {
      const now = new Date()
      const storyDate = new Date(story.timestamp)
      return (now - storyDate) < 24 * 60 * 60 * 1000 // 24 hours
    })
    setStories(validStories)
    // Update localStorage with only valid stories
    localStorage.setItem('stories', JSON.stringify(validStories))
  }, [])

  const addStory = (imageData) => {
    const newStory = {
      id: Date.now(),
      image: imageData,
      timestamp: new Date().toISOString()
    }
    const updatedStories = [...stories, newStory]
    setStories(updatedStories)
    localStorage.setItem('stories', JSON.stringify(updatedStories))
  }

  const openStory = (index) => {
    setCurrentStoryIndex(index)
  }

  const closeStory = () => {
    setCurrentStoryIndex(null)
  }

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      closeStory()
    }
  }

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <h1 className="text-xl font-bold p-4 border-b">24hr Stories</h1>
        
        <StoriesList 
          stories={stories} 
          onAddClick={() => setShowCreateModal(true)} 
          onStoryClick={openStory} 
        />
        
        {currentStoryIndex !== null && (
          <StoryViewer 
            story={stories[currentStoryIndex]} 
            onClose={closeStory}
            onNext={goToNextStory}
            onPrev={goToPrevStory}
          />
        )}
        
        {showCreateModal && (
          <CreateStory 
            onClose={() => setShowCreateModal(false)} 
            onSave={addStory} 
          />
        )}
      </div>
    </div>
  )
}

export default StoryFeature