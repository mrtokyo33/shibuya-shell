import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { AIAssistant } from './pages/AIAssistant'
import { Analysis } from './pages/Analysis'
import { ReportCreator } from './pages/ReportCreator'
import { Titlebar } from './components/Titlebar'
import { Background } from './components/Background'

function App() {
    return (
        <div id="App">
            <Background />
            <Titlebar />

            <div style={{ paddingTop: '32px', height: '100vh' }}>
                <main style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 32px)' }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/ai-assistant" element={<AIAssistant />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/report-creator" element={<ReportCreator />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default App