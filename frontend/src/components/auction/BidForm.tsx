import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useBids } from '../../hooks/useBids';
import { useAuth } from '../../contexts/AuthContext'; 
import type { Subasta } from '../../types';

interface BidFormProps {
  subasta: Subasta;
  onBidSuccess: () => void;
}

export const BidForm: React.FC<BidFormProps> = ({ subasta, onBidSuccess }) => {
  const { crearOferta, loading, error } = useBids();
  const { usuario } = useAuth(); 
  const [monto, setMonto] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  const montoMinimo = subasta.precioActual + 100; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!usuario) {
      setLocalError('Debes iniciar sesión para hacer una oferta');
      return;
    }

    const montoNum = parseFloat(monto);

    // Validaciones
    if (!monto || isNaN(montoNum)) {
      setLocalError('Ingresa un monto válido');
      return;
    }

    if (montoNum <= subasta.precioActual) {
      setLocalError(`La oferta debe ser mayor a $${subasta.precioActual.toLocaleString()}`);
      return;
    }

    if (montoNum < montoMinimo) {
      setLocalError(`La oferta mínima es de $${montoMinimo.toLocaleString()}`);
      return;
    }

    const resultado = await crearOferta(subasta.id, montoNum, usuario.id);

    if (resultado) {
      setMonto('');
      onBidSuccess();
      toast.success(`✅ ¡Oferta de $${montoNum.toLocaleString()} realizada con éxito!`);
    }
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
      setMonto(valor);
      setLocalError(null);
    }
  };

  const sugerirMonto = () => {
    setMonto(montoMinimo.toString());
  };

  if (!usuario) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h5 className="card-title mb-3">💰 Hacer una Oferta</h5>
          <p className="text-muted">Debes iniciar sesión para participar en esta subasta</p>
          <a href="/login" className="btn btn-primary">Iniciar Sesión</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">💰 Hacer una Oferta</h5>
        
        <div className="alert alert-info mb-3">
          <small>
            <strong>Oferta actual:</strong> ${subasta.precioActual.toLocaleString()}<br />
            <strong>Oferta mínima:</strong> ${montoMinimo.toLocaleString()}
          </small>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="monto" className="form-label">
              Tu oferta ($)
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="text"
                className="form-control"
                id="monto"
                value={monto}
                onChange={handleMontoChange}
                placeholder={montoMinimo.toString()}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={sugerirMonto}
            >
              Usar monto mínimo
            </button>
          </div>

          {(localError || error) && (
            <div className="alert alert-danger py-2">
              <small>{localError || error}</small>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading || !monto}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Procesando...
              </>
            ) : (
              <>🔨 Ofertar ${monto ? parseFloat(monto).toLocaleString() : '0'}</>
            )}
          </button>
        </form>

        <div className="mt-3">
          <small className="text-muted">
            ℹ️ Tu oferta será vinculante. Asegúrate de poder completar la compra.
          </small>
        </div>
      </div>
    </div>
  );
};