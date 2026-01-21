import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuctionListPage } from './AuctionListPage';
import { MyBidsPage } from './MyBidsPage';
import { MyAuctionsPage } from './MyAuctionsPage';

export const AuctionsPage: React.FC = () => {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'my-bids' | 'my-auctions'>('explore');

  if (!usuario) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>⚠️ Debes iniciar sesión</h4>
          <p>Para acceder a las subastas, inicia sesión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            🔍 Explorar Subastas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'my-bids' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bids')}
          >
            💰 Mis Ofertas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'my-auctions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-auctions')}
          >
            📦 Mis Subastas
          </button>
        </li>
      </ul>

      
      {activeTab === 'explore' && <AuctionListPage />}
      {activeTab === 'my-bids' && <MyBidsPage />}
      {activeTab === 'my-auctions' && <MyAuctionsPage />}
    </div>
  );
};