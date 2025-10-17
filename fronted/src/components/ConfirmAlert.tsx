import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmAlertProps {
  show: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({ show, title = "Confirmar acción", message = "¿Estás seguro?", onConfirm, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6 z-70">
        <button aria-label="Cerrar" className="absolute right-3 top-3 text-muted-foreground" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={onConfirm}>Sí, eliminar</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
