import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import TopBar from './components/TopBar/TopBar'
import MainContent from './components/MainContent/MainContent'

function App() {
  const [activeTab, setActiveTab] = useState('wiki')

  return (
    <>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <TopBar activeTab={activeTab} />
      <MainContent activeTab={activeTab} />
    </>
  )
}

export default App
