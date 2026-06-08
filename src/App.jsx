import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navigation from '../components/Layout/Navigation';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

import Home from './pages/HomePage';
import News from './pages/NewsPage';
import Blogs from './pages/BlogsPage';
import Forum from './pages/ForumPage';

function App() {
  return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-white text-gray-900">
                    <Header />
                    <Navigation />
                    
                    <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/news/:id" element={<News />} />
                            <Route path="/blogs" element={<Blogs />} />
                            <Route path="/forum" element={<Forum />} />
                            <Route path="/category/:categoryName" element={<Home />} />
                            <Route path="/login" element={<div className="p-8 text-center">Сторінка авторизації</div>} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App;