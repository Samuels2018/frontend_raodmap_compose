import { useState, useEffect, useRef } from 'react';
import alarmSound from './assets/alarm.mp3';

function App() {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const audioRef = useRef(null);

  // Calculate minutes and seconds for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Format time with leading zeros
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      clearInterval(interval);
      audioRef.current.play();
      
      if (sessionType === 'work') {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);
        
        // Determine if it's time for a long break
        if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
          setSessionType('longBreak');
          setTimeLeft(longBreakDuration * 60);
        } else {
          setSessionType('shortBreak');
          setTimeLeft(shortBreakDuration * 60);
        }
      } else {
        // Break completed, start work session
        setSessionType('work');
        setTimeLeft(workDuration * 60);
      }
      
      // Auto-start next session
      setIsActive(true);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, completedSessions, workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak]);
  
  // Reset timer when settings change
  useEffect(() => {
    if (sessionType === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (sessionType === 'shortBreak') {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionType]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (sessionType === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (sessionType === 'shortBreak') {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };
  
  const skipSession = () => {
    setIsActive(false);
    if (sessionType === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setSessionType('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setSessionType('shortBreak');
        setTimeLeft(shortBreakDuration * 60);
      }
    } else {
      setSessionType('work');
      setTimeLeft(workDuration * 60);
    }
  };
  
  const handleWorkDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setWorkDuration(value);
  };
  
  const handleShortBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setShortBreakDuration(value);
  };
  
  const handleLongBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setLongBreakDuration(value);
  };
  
  const handleSessionsBeforeLongBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setSessionsBeforeLongBreak(value);
  };
  
  const getSessionColor = () => {
    switch (sessionType) {
      case 'work':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <audio ref={audioRef} src={alarmSound} />
      
      <div className={`w-full max-w-md rounded-lg shadow-lg overflow-hidden transition-colors duration-300 ${getSessionColor()}`}>
        <div className="p-6 bg-white bg-opacity-90">
          {/* Session indicator */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {sessionType.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
              Sessions: {completedSessions}
            </span>
          </div>
          
          {/* Timer display */}
          <div className="text-center mb-8">
            <div className="text-7xl font-bold mb-4 font-mono text-gray-800">
              {formattedTime}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-full font-medium ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              aria-label={isActive ? 'Pause timer' : 'Start timer'}
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-full font-medium text-white transition-colors"
              aria-label="Reset timer"
            >
              Reset
            </button>
            <button
              onClick={skipSession}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-full font-medium text-white transition-colors"
              aria-label="Skip to next session"
            >
              Skip
            </button>
          </div>
          
          {/* Settings toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-800 underline text-sm"
              aria-expanded={showSettings}
              aria-controls="settings-panel"
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
        </div>
        
        {/* Settings panel */}
        {showSettings && (
          <div id="settings-panel" className="p-6 bg-white bg-opacity-90 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Timer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="workDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  id="workDuration"
                  min="1"
                  value={workDuration}
                  onChange={handleWorkDurationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="shortBreakDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Break Duration (minutes)
                </label>
                <input
                  type="number"
                  id="shortBreakDuration"
                  min="1"
                  value={shortBreakDuration}
                  onChange={handleShortBreakChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="longBreakDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Long Break Duration (minutes)
                </label>
                <input
                  type="number"
                  id="longBreakDuration"
                  min="1"
                  value={longBreakDuration}
                  onChange={handleLongBreakChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="sessionsBeforeLongBreak" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Sessions Before Long Break
                </label>
                <input
                  type="number"
                  id="sessionsBeforeLongBreak"
                  min="1"
                  value={sessionsBeforeLongBreak}
                  onChange={handleSessionsBeforeLongBreakChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo.</p>
        <p>Work for 25 minutes, then take a 5-minute break. After 4 work sessions, take a longer break.</p>
      </div>
    </div>
  );
}

export default App;