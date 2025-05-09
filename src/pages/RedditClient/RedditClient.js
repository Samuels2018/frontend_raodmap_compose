import { useState, useEffect } from 'react';
import SubredditLane from './SubredditLane';
import AddLaneForm from './AddLaneForm';

export default function App() {
  const [lanes, setLanes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved lanes from localStorage on initial render
  useEffect(() => {
    const savedLanes = localStorage.getItem('redditLanes');
    if (savedLanes) {
      setLanes(JSON.parse(savedLanes));
    }
  }, []);

  // Save lanes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('redditLanes', JSON.stringify(lanes));
  }, [lanes]);

  const addLane = async (subreddit) => {
    if (lanes.some(lane => lane.subreddit.toLowerCase() === subreddit.toLowerCase())) {
      setError(`Subreddit "${subreddit}" already exists`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      if (!response.ok) {
        throw new Error(`Subreddit "${subreddit}" not found`);
      }
      const data = await response.json();
      
      if (data.data.children.length === 0) {
        throw new Error(`Subreddit "${subreddit}" has no posts`);
      }

      const newLane = {
        subreddit,
        posts: data.data.children.slice(0, 10), // Get first 10 posts
        loading: false,
        error: null
      };

      setLanes([...lanes, newLane]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeLane = (subreddit) => {
    setLanes(lanes.filter(lane => lane.subreddit !== subreddit));
  };

  const refreshLane = async (subreddit) => {
    setLanes(lanes.map(lane => {
      if (lane.subreddit === subreddit) {
        return { ...lane, loading: true, error: null };
      }
      return lane;
    }));

    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      if (!response.ok) {
        throw new Error(`Failed to refresh "${subreddit}"`);
      }
      const data = await response.json();

      setLanes(lanes.map(lane => {
        if (lane.subreddit === subreddit) {
          return {
            ...lane,
            posts: data.data.children.slice(0, 10),
            loading: false,
            error: null
          };
        }
        return lane;
      }));
    } catch (err) {
      setLanes(lanes.map(lane => {
        if (lane.subreddit === subreddit) {
          return { ...lane, loading: false, error: err.message };
        }
        return lane;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reddit Client</h1>
        
        <AddLaneForm 
          onAddLane={addLane} 
          isLoading={isLoading} 
          error={error} 
          clearError={() => setError(null)} 
        />

        {lanes.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No subreddits added yet. Add one to get started!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {lanes.map((lane) => (
            <SubredditLane
              key={lane.subreddit}
              subreddit={lane.subreddit}
              posts={lane.posts}
              loading={lane.loading}
              error={lane.error}
              onRemove={() => removeLane(lane.subreddit)}
              onRefresh={() => refreshLane(lane.subreddit)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}