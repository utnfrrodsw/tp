import React, { useEffect, useState } from 'react';

type TurnoDisplay = {
	id: number;
	cliente: string;
	fecha: string;
	hora: string;
	estado: string;
	tarea: string;
	avatar: string;
	monto: number;
};

type TurnoDetailsModalProps = {
	isVisible: boolean;
	turnoDetails: TurnoDisplay | null;
	onClose: () => void;
};

const TurnoDetailsModal: React.FC<TurnoDetailsModalProps> = ({
	isVisible,
	turnoDetails,
	onClose
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isVisible && turnoDetails) {
			setShouldRender(true);
			// Pequeño delay para que se renderice antes de la animación
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			// Esperar a que termine la animación antes de desrenderizar
			setTimeout(() => setShouldRender(false), 200);
		}
	}, [isVisible, turnoDetails]);

	const handleClose = () => {
		setIsAnimating(false);
		setTimeout(() => onClose(), 200);
	};

	if (!shouldRender) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div 
				className={`absolute inset-0 bg-black transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-0'}`} 
				onClick={handleClose}
			></div>
			<div className={`relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-200 ${
				isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
			}`}>
				<button
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
					onClick={handleClose}
				>
					×
				</button>
				<h2 className="text-xl font-bold mb-4 text-gray-800">Detalles del Turno</h2>
				<div className="space-y-3">
					<div>
						<span className="font-semibold text-gray-600">Cliente:</span>
						<p className="text-gray-800">{turnoDetails!.cliente}</p>
					</div>
					<div>
						<span className="font-semibold text-gray-600">Fecha:</span>
						<p className="text-gray-800">{turnoDetails!.fecha}</p>
					</div>
					<div>
						<span className="font-semibold text-gray-600">Hora:</span>
						<p className="text-gray-800">{turnoDetails!.hora}</p>
					</div>
					<div>
						<span className="font-semibold text-gray-600">Estado:</span>
						<p className={`inline-block px-2 py-1 rounded text-sm font-medium ${
							turnoDetails!.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
							turnoDetails!.estado === 'Confirmado' ? 'bg-blue-100 text-blue-800' :
							turnoDetails!.estado === 'Completado' ? 'bg-green-100 text-green-800' :
							'bg-red-100 text-red-800'
						}`}>
							{turnoDetails!.estado}
						</p>
					</div>
					<div>
						<span className="font-semibold text-gray-600">Tarea:</span>
						<p className="text-gray-800">{turnoDetails!.tarea}</p>
					</div>
					<div>
						<span className="font-semibold text-gray-600">Monto:</span>
						<p className="text-gray-800">${turnoDetails!.monto}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TurnoDetailsModal;
