import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Wallet as WalletIcon, Check } from "lucide-react";
import { wallets } from "./data/wallets.tsx";
import ConfirmAlert from "./ConfirmAlert";

interface WalletSelectionModalProps {
  isOpen: boolean;
  onSelectWallets: (walletIds: string[]) => void;
  onClose?: () => void;
  selectedWallets?: string[];
}

const WalletSelectorCrud = ({ isOpen, onSelectWallets, onClose, selectedWallets: initialSelectedWallets = [] }: WalletSelectionModalProps) => {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  useEffect(() => {
    setSelectedWallets(initialSelectedWallets || []);
  }, [initialSelectedWallets]);

  const handleWalletToggle = (walletId: string) => {
    setSelectedWallets(prev => {
      if (prev.includes(walletId)) {
        // request confirmation before removing
        setPendingRemove(walletId);
        setConfirmOpen(true);
        return prev;
      } else {
        return [...prev, walletId];
      }
    });
  };

  const confirmRemove = () => {
  if (!pendingRemove) return;
  const next = selectedWallets.filter(id => id !== pendingRemove);
  setSelectedWallets(next);
  setPendingRemove(null);
  setConfirmOpen(false);
  // notify parent with updated selection (do NOT close the parent modal)
  onSelectWallets(next);
  };

  const cancelRemove = () => {
    setPendingRemove(null);
    setConfirmOpen(false);
  };

  const handleContinue = () => {
    if (selectedWallets.length > 0) {
      onSelectWallets(selectedWallets);
    }
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && onClose) { onClose(); } }}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate">
              <WalletIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center">
              Tus Billeteras Virtuales
            </DialogTitle>
            <p className="text-muted-foreground text-center">
              Elige una o varias billeteras virtuales para ver todos los beneficios disponibles
            </p>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-2">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`flex items-center justify-between gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                selectedWallets.includes(wallet.id)
                  ? "border-primary bg-gradient-secondary shadow animate-glow"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleWalletToggle(wallet.id)}
            >
              <div className={`p-2 rounded-full flex items-center justify-center`}>
                {wallet.image ? (
                  <img src={wallet.image} alt={wallet.name} className="w-6 h-6 object-contain " />
                ) : (
                  wallet.icon
                )}
              </div>
              <span className="flex-1 text-center font-medium text-card-foreground text-base">
                {wallet.name}
              </span>
              <span className="flex items-center justify-center w-8">
                {selectedWallets.includes(wallet.id) && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            {selectedWallets.length} billetera{selectedWallets.length !== 1 ? 's' : ''} seleccionada{selectedWallets.length !== 1 ? 's' : ''}
          </p>
          <Button
            onClick={handleContinue}
            disabled={selectedWallets.length === 0}
            className="w-full py-6 bg-gradient-primary hover:opacity-90 text-lg font-semibold group"
            size="lg"
          >
            Continuar
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <ConfirmAlert
          show={confirmOpen}
          title="¿Eliminar billetera?"
          message="Estás por eliminar una billetera seleccionada. ¿Seguro que querés continuar?"
          onConfirm={confirmRemove}
          onClose={cancelRemove}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelectorCrud;
