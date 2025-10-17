import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Settings, Wallet } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import WalletSelectorCrud from "@/components/WalletSelectorCrud";
import AccountModal from "@/components/AccountModal";
import NotificationsModal from "@/components/NotificationsModal";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={checked => setTheme(checked ? "dark" : "light")}
      aria-label="Alternar modo oscuro"
    />
  );
}

interface HeaderProps {
  userName?: string;
  selectedWallet: string | undefined;
  selectedWallets: string[];
  onUpdateSelectedWallets: (ids: string[]) => void;
  onBackToWalletSelection: () => void;
  onLogout: () => void;
}

const walletNames: Record<string, string> = {
  mercadopago: "Mercado Pago",
  rapipago: "Rapipago",
  pagofacil: "Pago Fácil",
  ualá: "Ualá"
};

const Header = ({ userName, selectedWallet, selectedWallets, onUpdateSelectedWallets, onBackToWalletSelection, onLogout }: HeaderProps) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Descubre tus Beneficios
            </h1>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Configuraciones</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Modo oscuro</span>
                <ThemeToggle />
              </div>
              <Button variant="secondary" className="w-full" onClick={() => setShowWalletModal(true)}>
                Billeteras
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setShowNotificationsModal(true)}>
                Notificaciones
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setShowAccountModal(true)}>
                Cuenta
              </Button>
              <Button variant="destructive" className="w-full mt-2" onClick={onLogout}>Cerrar sesión</Button>
            </div>
          </SheetContent>
        </Sheet>
  {/* Modal de billeteras */}
  <WalletSelectorCrud isOpen={showWalletModal} selectedWallets={selectedWallets} onSelectWallets={(ids) => { onUpdateSelectedWallets(ids); setShowWalletModal(false); }} onClose={() => setShowWalletModal(false)} />
  {/* Modal de cuenta */}
  <AccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
  {/* Modal de notificaciones */}
  <NotificationsModal isOpen={showNotificationsModal} availableWallets={selectedWallets} onClose={() => setShowNotificationsModal(false)} />
      </div>
    </div>
  );
};

export default Header;

// export default Header;
