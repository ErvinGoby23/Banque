import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Virement from './pages/Virement';
import Crypto from './pages/Crypto';
import Dashboard from './pages/Dashboard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Courant from './pages/Courant';
import LivretA from './pages/LivretA';
import Bourse from './pages/Bourse';

const AppContent = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

    const shouldHideNavbar = hideNavbarRoutes.some(path => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    });

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/virement" element={<Virement />} />
                <Route path="/crypto" element={<Crypto />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courant" element={<Courant />} />
                <Route path="/livretA" element={<LivretA />} />
                <Route path="/bourse" element={<Bourse />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
