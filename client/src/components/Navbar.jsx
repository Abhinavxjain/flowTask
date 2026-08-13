import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #ddd' }}>
      <Link to="/dashboard" style={{ fontWeight: 'bold', textDecoration: 'none' }}>FlowTask</Link>
      <div>
        <span style={{ marginRight: '12px' }}>Hi, {user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;