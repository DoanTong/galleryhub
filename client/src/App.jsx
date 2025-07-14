import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MarketplacePage from './pages/MarketplacePage';
import NotFound from './pages/NotFound';
import ExhibitionPage from './pages/events/ExhibitionPage';
import TicketNFT from './pages/events/TicketNFT';
import RewardNFTPage from './pages/events/RewardNFTPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/events" element={<ExhibitionPage />} />
                        <Route path="/events/ticket" element={<TicketNFT />} />
                        <Route path="/events/reward" element={<RewardNFTPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;