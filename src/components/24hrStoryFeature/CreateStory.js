import { useState, useRef } from 'react'

const CreateStory = ({ onClose, onSave }) => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check image dimensions
    const img = new Image()
    img.onload = function() {
      if (this.width > 1080 || this.height > 1920) {
        alert('Image dimensions should not exceed 1080x1920 pixels')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
    img.src = URL.createObjectURL(file)
  }

  const handleSave = () => {
    if (image) {
      onSave(image)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
          <h2 className="font-bold">New Story</h2>
          <button 
            onClick={handleSave} 
            className={`font-bold ${image ? 'text-blue-500' : 'text-gray-300'}`}
            disabled={!image}
          >
            Share
          </button>
        </div>
        
        <div className="p-4">
          {preview ? (
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div 
              className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="mt-2 text-gray-500">Select an image</p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateStory