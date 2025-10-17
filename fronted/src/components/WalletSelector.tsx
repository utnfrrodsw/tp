import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Wallet, CreditCard, Smartphone } from "lucide-react";

interface Wallet {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const wallets: Wallet[] = [
  {
    id: "mercadopago",
    name: "Mercado Pago",
    icon: <Wallet className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "Personal Pay",
    name: "Personal Pay",
    icon: <CreditCard className="w-8 h-8" />,
    color: "from-red-500 to-red-600"
  },
  {
    id: "Naranja x",
    name: "Naranja x",
    icon: <Smartphone className="w-8 h-8" />,
    color: "from-green-500 to-green-600"
  },
  {
    id: "ualá",
    name: "Ualá",
    icon: <CreditCard className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600"
  }
];

interface WalletSelectorProps {
  onSelectWallet: (walletId: string) => void;
}

const WalletSelector = ({ onSelectWallet }: WalletSelectorProps) => {
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const handleContinue = () => {
    if (selectedWallet) {
      onSelectWallet(selectedWallet);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
            <Wallet className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Selecciona tu Billetera Virtual
          </h1>
          <p className="text-muted-foreground">
            Elige tu billetera virtual favorita para ver todos los beneficios disponibles
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
                selectedWallet === wallet.id
                  ? "border-primary bg-gradient-secondary shadow-lg animate-glow"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full">
                  {wallet.icon}
                </div>
                <span className="font-semibold text-card-foreground text-center">
                  {wallet.name}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedWallet}
          className="w-full py-6 bg-gradient-primary hover:opacity-90 text-lg font-semibold group"
          size="lg"
        >
          Continuar
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default WalletSelector;