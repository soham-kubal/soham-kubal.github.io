import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ToolsLayout from './components/tools/ToolsLayout'
import Home from './pages/Home'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import ToolsHub from './pages/tools/ToolsHub'
import JmxFilter from './pages/tools/JmxFilter'
import Renumberer from './pages/tools/Renumberer'
import HashTreeValidator from './pages/tools/HashTreeValidator'
import HarToJmx from './pages/tools/HarToJmx'
import DisabledCleaner from './pages/tools/DisabledCleaner'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="resume" element={<Resume />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tools" element={<ToolsLayout />}>
          <Route index element={<ToolsHub />} />
          <Route path="jmx-filter" element={<JmxFilter />} />
          <Route path="renumberer" element={<Renumberer />} />
          <Route path="hashtree-validator" element={<HashTreeValidator />} />
          <Route path="har-to-jmx" element={<HarToJmx />} />
          <Route path="disabled-cleaner" element={<DisabledCleaner />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
