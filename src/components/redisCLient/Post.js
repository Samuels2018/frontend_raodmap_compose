const Post = ({ post }) => {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center">
          <button className="text-gray-500 hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-xs font-bold">{formatNumber(post.ups)}</span>
          <button className="text-gray-500 hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            <a 
              href={`https://reddit.com${post.permalink}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {post.title}
            </a>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Posted by <span className="text-blue-600">u/{post.author}</span>
          </p>
          {post.thumbnail && post.thumbnail !== 'self' && (
            <img 
              src={post.thumbnail} 
              alt="" 
              className="mt-2 rounded max-w-full h-auto max-h-40 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Post