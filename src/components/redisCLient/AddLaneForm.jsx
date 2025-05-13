import { useState } from 'react'

const AddLaneForm = ({ onAddLane, isLoading, error, clearError }) => {
  const [subreddit, setSubreddit] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (subreddit.trim()) {
      onAddLane(subreddit.trim())
      setSubreddit('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="subreddit" className="sr-only">Subreddit</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">r/</span>
            </div>
            <input
              type="text"
              id="subreddit"
              value={subreddit}
              onChange={(e) => {
                clearError()
                setSubreddit(e.target.value)
              }}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-4 border"
              placeholder="subreddit"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !subreddit.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Subreddit'}
        </button>
      </form>
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  )
}

export default AddLaneForm