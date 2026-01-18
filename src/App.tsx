import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AlliancePage } from './pages/AlliancePage';
import { LabPage } from './pages/LabPage';
import { EssencePage } from './pages/EssencePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/alliance" element={<AlliancePage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/essence" element={<EssencePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
