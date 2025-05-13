import {Route} from 'react-router-dom'
import AgeCalculator from './AgeCalculator/AgeCalculator'
import Error404 from './Error404/Error404'
import TemperatureConverter from './TemperatureConverter/TemperatureConverter'
import GitHubRandomPage from './GitHubRandom/GitHubRandom'
import PomodoroTimer from './PomodoroTimer/PromodoroTimer'
import TaskTracker from './TaskTracker/TaskTracker'
import FlashCardsPage from './FlashCards/FlashCards'
import QuizApp from './QuizApp/QuizApp'
import RedisclientPage from './RedditClient/RedditClient'
import WeatheApi from './weather/WeatherApi'
import StoryFeature from './24hrStoryFeature/24hrStoryFeature'


export const routes = [
  {
    path: '/',
    element: <AgeCalculator />,
    protected: false,
  },
  {
    path: '/temperature',
    element: <TemperatureConverter />,
    protected: false,
  },
  {
    path: '/github-ramdom',
    element: <GitHubRandomPage />,
    protected: false
  },
  {
    path: '/timer',
    element: <PomodoroTimer />,
    protected: false
  },
  {
    path: '/task',
    element: <TaskTracker />,
    protected: false
  },
  {
    path: '/flash-cards',
    element: <FlashCardsPage />,
    protected: false
  },
  {
    path: '/quiz',
    element: <QuizApp />,
    protected: false
  },
  {
    path: 'redis',
    element: <RedisclientPage />,
    protected: false
  },
  {
    path: '/weather',
    element: <WeatheApi />,
    protected: false
  },
  {
    path: '/stories',
    element: <StoryFeature />,
    protected: false
  },
  {
    path: "*",
    element: <Error404 />,
    protected: false
  }
]