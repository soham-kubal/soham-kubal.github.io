import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import Tools from './pages/Tools'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="resume" element={<Resume />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tools" element={<Tools />} />
      </Route>
    </Routes>
  )
}

export default App
