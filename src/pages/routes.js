import {Route} from 'react-router-dom'
import AgeCalculator from './AgeCalculator/AgeCalculator'
import Error404 from './Error404/Error404'
import TemperatureConverter from './TemperatureConverter/TemperatureConverter'
import GitHubRandom from './GitHubRandom/GitHubRandom'
import PomodoroTimer from './PomodoroTimer/PromodoroTimer'
import TaskTracker from './TaskTracker/TaskTracker'
import FlashCardsPage from './FlashCards/FlashCards'
import QuizApp from './QuizApp/QuizApp'
import RedisclientPage from './RedditClient/RedditClient'


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
    element: <GitHubRandom />,
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
    path: "*",
    element: <Error404 />,
    protected: false
  }
]