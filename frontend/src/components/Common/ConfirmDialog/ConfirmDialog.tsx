import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Confirmar",
  message,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1400,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--tf-card, #ffffff)",
          color: "var(--tf-text, #0f172a)",
          border: "1px solid var(--tf-border, #e5e7eb)",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          {danger && (
            <span style={{ color: "#dc2626", display: "inline-flex" }}>
              <AlertTriangle size={20} />
            </span>
          )}
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
        </div>

        <p style={{ margin: "0 0 20px", color: "var(--tf-muted)", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              background: "transparent",
              color: "var(--tf-text, #0f172a)",
              border: "1px solid var(--tf-border, #e5e7eb)",
              fontWeight: 600,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              background: danger ? "#dc2626" : "var(--tf-primary, #4f46e5)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
