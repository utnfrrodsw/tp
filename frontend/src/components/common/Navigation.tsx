// src/components/common/Navigation.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../context/useCart';

export const Navigation: React.FC = () => {
  const { usuario, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);


  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const linksClass = `nav-links ${menuOpen ? 'd-block' : 'd-none'} d-md-flex`;

  return (
    <nav className="bg-blue-600 text-white p-3 p-md-4">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="text-decoration-none d-flex align-items-center" onClick={() => setMenuOpen(false)} style={{ gap: '10px' }}>
          <button
            type="button"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '12px',
              background: 'white',
              color: '#2563eb',
              fontWeight: 900,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '2px solid #2563eb',
              transition: 'background 0.2s',
              padding: 0,
              lineHeight: 1.1,
              minWidth: 60,
              minHeight: 60,
            }}
            title="Ir a inicio"
            className="border-0"
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px' }}>Tienda</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '2px', marginTop: '-2px' }}>Retro</span>
          </button>
        </Link>

        {}
        <button 
          className="btn btn-outline-light d-md-none"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(v => !v)}
          type="button"
        >
          ☰
        </button>

        <div className={linksClass} style={{ gap: '32px', fontSize: '1.08rem', justifyContent: 'flex-end', width: '100%' }}>
          <Link to="/catalog" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
            Catálogo
          </Link>
          
          {isAuthenticated && (
            <Link to="/auctions" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
              🔨 Subastas
            </Link>
          )}
          
          <Link to="/cart" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif', position: 'relative', display: 'inline-block' }} onClick={() => setMenuOpen(false)}>
            🛒 Carrito
            {totalItems > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 'bold', borderRadius: '12px', padding: '4px 8px', minWidth: '20px', textAlign: 'center', display: 'inline-block', lineHeight: '1', marginLeft: '4px' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                📋 Órdenes
              </Link>
              <Link to="/profile" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                👤 Perfil
              </Link>
              <Link to="/my-products" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                🧾 Mis Publicaciones
              </Link>
              {usuario?.rol === 'administrador' && (
                <Link to="/admin/dashboard" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                  👨‍💼 Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link px-2" style={{ color: '#2563eb', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter, Arial, sans-serif' }} onClick={() => setMenuOpen(false)}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};