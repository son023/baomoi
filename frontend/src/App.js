import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import ArticlePage from './pages/ArticlePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          {/* Auth routes without header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Public routes with header */}
          <Route path="/*" element={
            <>
              <Header />
              <MainContent>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/tag/:tagName" element={<TagPage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                </Routes>
              </MainContent>
            </>
          } />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
