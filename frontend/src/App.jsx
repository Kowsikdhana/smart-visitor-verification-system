import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashboardPage';
import RegisterVisitorPage from './pages/RegisterVisitorPage';
import CurrentVisitorsPage from './pages/CurrentVisitorsPage';
import VisitorHistoryPage from './pages/VisitorHistoryPage';
import VisitDetailsPage from './pages/VisitDetailsPage';
import ResidentsPage from './pages/ResidentsPage';
import LoginPage from './pages/LoginPage';

/**
 * App Component
 *
 * Configures client-side routing via React Router DOM.
 * Eliminates full-page browser reloads when navigating between views.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/register" element={<RegisterVisitorPage />} />
            <Route path="/current" element={<CurrentVisitorsPage />} />
            <Route path="/history" element={<VisitorHistoryPage />} />
            <Route path="/visits/:id" element={<VisitDetailsPage />} />
            <Route path="/residents" element={<ResidentsPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Fallback wildcard route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-top py-3 mt-auto text-center text-muted small no-print">
          <div className="container">
            <span>&copy; {new Date().getFullYear()} Smart Visitor Verification System &bull; Gate Security Management &bull; Built with React, Spring Boot & MySQL</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
