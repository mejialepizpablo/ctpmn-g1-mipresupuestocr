import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Target, Wallet } from 'lucide-react';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <Wallet size={28} />
            <span>MiPresupuesto CR</span>
          </div>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/movimientos" className={({ isActive }) => isActive ? 'active' : ''}>
                <ArrowLeftRight size={18} />
                Movimientos
              </NavLink>
            </li>
            <li>
              <NavLink to="/metas" className={({ isActive }) => isActive ? 'active' : ''}>
                <Target size={18} />
                Metas
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;