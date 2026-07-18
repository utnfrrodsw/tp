import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type BottomPanelProps = {
  trigger?: ReactNode;        // 👈 trigger custom completo
  buttonTitle?: string;       // 👈 ahora opcional
  buttonStyle?: React.CSSProperties;  // 👈 para ajustar el botón default
  title?: string;
  description?: string;
  children?: ReactNode;
};

function BottomPanel({
  trigger,
  buttonTitle,
  buttonStyle,
  title,
  description,
  children,
}: BottomPanelProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            style={{
              borderRadius: "var(--radius-pill)",
              border: "1.5px solid var(--tf-border)",
              backgroundColor: "var(--tf-white)",
              color: "var(--tf-primary)",
              fontWeight: 600,
              boxShadow: "var(--shadow-soft)",
              transition: "all var(--transition-fast)",
              ...buttonStyle,
            }}
          >
            {buttonTitle}
          </Button>
        )}
      </DialogTrigger>
 
      {/* PANEL */}
      <DialogContent
        showCloseButton={false}
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          top: "auto",
          transform: "translateX(-50%)",
          width: "min(720px, 92vw)",
          maxHeight: "85vh",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          border: "1.5px solid var(--tf-border)",
          borderBottom: "none",
          backgroundColor: "var(--tf-card)",
          boxShadow: "var(--shadow-medium)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
 
        {/* PASTILLA */}
        <div style={{
          width: "36px",
          height: "4px",
          borderRadius: "var(--radius-pill)",
          backgroundColor: "var(--tf-border)",
          margin: "12px auto 0",
          flexShrink: 0,
        }} />
 
        {/* HEADER */}
        <DialogHeader
          style={{
            padding: "20px 28px 18px",
            borderBottom: "1px solid var(--tf-border)",
            textAlign: "left",
            flexShrink: 0,
          }}
        >
          <DialogTitle
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--tf-text)",
            }}
          >
            {title}
          </DialogTitle>
 
          <DialogDescription
            style={{
              fontSize: "13px",
              color: "var(--tf-muted)",
              lineHeight: 1.5,
              marginTop: "3px",
            }}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
 
        {/* CONTENIDO */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            scrollbarWidth: "none",
          }}
        >
          {children}
        </div>
 
        {/* FOOTER 
        <DialogFooter
          style={{
            padding: "14px 28px 20px",
            borderTop: "1px solid var(--tf-border)",
            backgroundColor: "var(--tf-bg)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <DialogClose asChild>
            <Button
              variant="outline"
              style={{
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--tf-border)",
                backgroundColor: "var(--tf-white)",
                color: "var(--tf-muted)",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Cancelar
            </Button>
          </DialogClose>
 
          <Button
            type="submit"
            style={{
              borderRadius: "var(--radius-md)",
              padding: "0 22px",
              fontWeight: 600,
              fontSize: "13px",
              backgroundColor: "var(--tf-primary)",
              boxShadow: "var(--shadow-primary)",
              border: "none",
              color: "#fff",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--tf-primary-dark)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--tf-primary)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
 */}
      </DialogContent>
    </Dialog>
  );
}

export default BottomPanel;