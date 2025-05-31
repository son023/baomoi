import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authHelpers } from '../services/api';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;

const LoginButton = styled(Link)`
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const RegisterButton = styled(Link)`
  background: rgba(255,255,255,0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s ease;
  border: 1px solid rgba(255,255,255,0.3);
  
  &:hover {
    background: rgba(255,255,255,0.4);
    border-color: rgba(255,255,255,0.5);
  }
`;

const LogoutButton = styled.button`
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const AdminLink = styled(Link)`
  background: rgba(255,255,255,0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background: rgba(255,255,255,0.4);
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  &::placeholder {
    color: #999;
  }
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  padding: 10px 0;
  min-width: 200px;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  transition: all 0.3s ease;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
  }
`;

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authHelpers.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authHelpers.removeToken();
    setUser(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <TopSection>
          <Logo to="/">BaoMoi.com</Logo>
          <UserSection>
            {user ? (
              <>
                <UserInfo>
                  <span>Xin chào, {user.full_name || user.username}</span>
                  {user.role === 'admin' && (
                    <AdminLink to="/admin">Admin</AdminLink>
                  )}
                </UserInfo>
                <LogoutButton onClick={handleLogout}>Đăng xuất</LogoutButton>
              </>
            ) : (
              <>
                <LoginButton to="/login">Đăng nhập</LoginButton>
                <RegisterButton to="/register">Đăng ký</RegisterButton>
              </>
            )}
          </UserSection>
        </TopSection>

        <SearchSection>
          <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
              <SearchInput 
                type="text" 
                placeholder="Tìm kiếm bài viết, chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </form>
          </SearchContainer>
        </SearchSection>

        <Navigation>
          <NavList>
            <NavItem>
              <NavLink to="/">Trang chủ</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/category/tin-tuc-su-kien">Tin tức - Sự kiện</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/category/tam-ly-cuoc-song">Tâm lý với cuộc sống</NavLink>
            </NavItem>
            <NavItem 
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <NavLink to="/category/van-de-tam-ly">Vấn đề tâm lý</NavLink>
              <DropdownMenu show={showDropdown}>
                <DropdownItem to="/category/tram-cam">Trầm cảm</DropdownItem>
                <DropdownItem to="/category/stress">Stress</DropdownItem>
                <DropdownItem to="/category/roi-loan-lo-au">Rối loạn lo âu</DropdownItem>
              </DropdownMenu>
            </NavItem>
          </NavList>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 