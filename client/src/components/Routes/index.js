import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
import NavBar from '../NavBar';
const Index = () => {
    return (
        <Router>
            <NavBar></NavBar>
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/profil"  element={<Profil/>} />
                <Route exact path="/trending"  element={<Trending/>} />
                <Route path="/*" element={<Navigate to='/' replace />} />

            </Routes>
        </Router>
    );
}

export default Index;