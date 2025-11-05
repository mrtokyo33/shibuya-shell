import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import AIAssistant from './pages/AIAssistant'
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
                <Routes>
                    <Route path="/" element={
                        <main style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 32px)' }}>
                            <Dashboard />
                        </main>
                    } />
                    <Route path="/settings" element={
                        <main style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 32px)' }}>
                            <Settings />
                        </main>
                    } />
                    <Route path="/ai-assistant" element={
                        <main style={{ padding: '32px', height: 'calc(100vh - 32px)', overflow: 'hidden' }}>
                            <AIAssistant />
                        </main>
                    } />
                    <Route path="/analysis" element={
                        <main style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 32px)' }}>
                            <Analysis />
                        </main>
                    } />
                    <Route path="/report-creator" element={
                        <main style={{ padding: '32px', overflowY: 'auto', height: 'calc(100vh - 32px)' }}>
                            <ReportCreator />
                        </main>
                    } />
                </Routes>
            </div>
        </div>
    )
}

export default App