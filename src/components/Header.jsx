import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Header({ usuario, toggleSidebar }) {
  const { logout } = useAppContext();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      
      <div className="user-menu">
        <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="user-avatar">
            {getInitials(usuario)}
          </div>
          <span className="user-name">{usuario}</span>
        </div>

        <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
          <button onClick={handleLogout}>
            <span style={{ marginRight: '10px' }}>🔐</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}