import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Wallet, Check } from "lucide-react";
import { wallets } from "./data/wallets.tsx";


interface WalletSelectionModalProps {
  isOpen: boolean;
  onSelectWallets: (walletIds: string[]) => void;
  onClose?: () => void;
}

const WalletSelectionModal = ({ isOpen, onSelectWallets, onClose }: WalletSelectionModalProps) => {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

  const handleWalletToggle = (walletId: string) => {
    setSelectedWallets(prev => {
      if (prev.includes(walletId)) {
        return prev.filter(id => id !== walletId);
      } else {
        return [...prev, walletId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedWallets.length > 0) {
      onSelectWallets(selectedWallets);
  if (onClose) onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open && onClose) onClose(); }}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center">
              Selecciona tus Billeteras Virtuales
            </DialogTitle>
            <p className="text-muted-foreground text-center">
              Elige una o varias billeteras virtuales para ver todos los beneficios disponibles
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2">
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className={`p-4 cursor-pointer transition-all hover:scale-105 border-2 relative ${
                selectedWallets.includes(wallet.id)
                  ? "border-primary bg-gradient-secondary shadow-lg animate-glow"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleWalletToggle(wallet.id)}
            >
              {selectedWallets.includes(wallet.id) && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="flex flex-col items-center space-y-2">
              <div className={`p-2 rounded-full ${wallet.image ? 'bg-white' : ''}`}>
                  {wallet.image ? (
                    <img src={wallet.image} alt={wallet.name} className="w-6 h-6 object-contain" />
                  ) : (
                    wallet.icon
                  )}
                </div>
                <span className="font-medium text-card-foreground text-center text-sm">
                  {wallet.name}
                </span>
              </div>
            </Card>
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
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelectionModal;
