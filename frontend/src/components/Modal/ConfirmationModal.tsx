import React, { useEffect, useState } from 'react';

type ConfirmationModalProps = {
	isVisible: boolean;
	pendingAction: 'Confirmado' | 'Cancelado' | 'Completado' | null;
	validSelectedCount: number;
	invalidSelectedCount: number;
	onConfirm: () => void;
	onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isVisible,
	pendingAction,
	validSelectedCount,
	invalidSelectedCount,
	onConfirm,
	onCancel
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isVisible && pendingAction) {
			setShouldRender(true);
			// Pequeño delay para que se renderice antes de la animación
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			// Esperar a que termine la animación antes de desrenderizar
			setTimeout(() => setShouldRender(false), 200);
		}
	}, [isVisible, pendingAction]);

	const handleConfirm = () => {
		setIsAnimating(false);
		setTimeout(() => onConfirm(), 200);
	};

	const handleCancel = () => {
		setIsAnimating(false);
		setTimeout(() => onCancel(), 200);
	};

	if (!shouldRender) {
		return null;
	}

	const getActionText = () => {
		switch (pendingAction) {
			case 'Confirmado': return 'confirmar';
			case 'Cancelado': return 'cancelar';
			case 'Completado': return 'completar';
			default: return '';
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div 
				className={`absolute inset-0 bg-black transition-opacity duration-200 ${isAnimating ? 'opacity-20' : 'opacity-0'}`}
			></div>
			<div className={`relative bg-white border border-gray-300 rounded-lg shadow-lg p-6 min-w-[300px] flex flex-col items-center transform transition-all duration-200 ${
				isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
			}`}>
				<span className="text-lg font-semibold mb-4 text-gray-900">
					¿Seguro que quieres {getActionText()} los turnos seleccionados?
				</span>
				<span className="text-sm text-gray-700 mb-2">
					Se van a actualizar {validSelectedCount} turno(s).
				</span>
				{invalidSelectedCount > 0 && (
					<span className="text-sm text-red-500 mb-2">
						{invalidSelectedCount} turno(s) no se pueden actualizar debido a su estado.
					</span>
				)}
				<div className="flex gap-4">
					<button 
						className="bg-orange-500 text-white px-4 py-2 rounded font-medium hover:bg-orange-600 cursor-pointer" 
						onClick={handleConfirm}
					>
						Sí, {getActionText()}
					</button>
					<button 
						className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 cursor-pointer" 
						onClick={handleCancel}
					>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
