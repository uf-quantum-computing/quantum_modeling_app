import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="left-section">
                <Link to="/" className="logo">
                    <img src="/logo512.png" alt="Home" />
                </Link>
                <Link to="/" className="title">
                    Quantum Modeling
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/tunneling">Tunneling</Link>
                <Link to="/interference">Interference</Link>
                <Link to="/spintraceevo">Spin Trace Evolution</Link>
            </div>
        </nav>
    );
};

export default Navbar;
