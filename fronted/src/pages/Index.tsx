import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletSelectionModal from "@/components/WalletSelectionModal";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import BenefitsGrid from "@/components/BenefitsGrid";
import BenefitDetail from "@/components/BenefitDetail";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InterestWalletsList from "@/components/InterestWalletsList";
import { usePersonaAuth } from "@/context/personaContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { persona, isAuthenticated, logout } = usePersonaAuth();
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDiscountType, setSelectedDiscountType] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);
  const [walletFilter, setWalletFilter] = useState<string | null>(null);

  // Redirigir a /login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mientras se redirige, no renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  const handleWalletsSelect = (walletIds: string[]) => {
    setSelectedWallets(walletIds);
    setShowModal(false);
  };

  const handleBackToWalletSelection = () => {
    setSelectedWallets([]);
    setSelectedCategory("all");
    setShowModal(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDiscountTypeSelect = (discountType: string) => {
    setSelectedDiscountType(discountType);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Mostrar selección de billeteras si no se han seleccionado aún
  if (showModal || selectedWallets.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Beneficios de Billeteras Virtuales
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre las mejores ofertas y descuentos disponibles
          </p>
        </div>
        <WalletSelectionModal 
          isOpen={showModal}
          onSelectWallets={handleWalletsSelect}
        />
      </div>
    );
  }

  if (selectedBenefit) {
    return <BenefitDetail benefit={selectedBenefit} onBack={() => setSelectedBenefit(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={persona?.name || "Usuario"}
        selectedWallet={selectedWallets[0]}
        selectedWallets={selectedWallets}
        onUpdateSelectedWallets={setSelectedWallets}
        onBackToWalletSelection={handleBackToWalletSelection}
        onLogout={logout}
      />
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        <div className="text-center space-y-4">
          {/* Espacio para imagen rectangular */}
          <div className="flex justify-center mb-4">
            <div className="w-[800px] h-[300px] bg-muted rounded-xl overflow-hidden flex items-center justify-center">
              {/* Aquí puedes colocar tu imagen: <img src="/ruta/imagen.jpg" alt="Banner" className="w-full h-full object-cover rounded-xl" /> */}
              <img
                src={`${import.meta.env.BASE_URL}wallets/git/Tito_Calder_n_Bailando.gif`}
                alt="Banner"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
          <h1 className="max-w-7xl mx-auto p-6 space-y-8 text-2xl font-bold">
            Encuentra las mejores ofertas y descuentos disponibles con tus billeteras virtuales
          </h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium shadow hover:bg-primary hover:text-primary-foreground transition">
                    {walletFilter
                      ? selectedWallets.find(w => w === walletFilter)?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())
                      : "Filtrar billetera"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrar por billetera</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setWalletFilter(null)}>
                    Todas
                  </DropdownMenuItem>
                  {selectedWallets.map(walletId => (
                    <DropdownMenuItem key={walletId} onClick={() => setWalletFilter(walletId)}>
                      {walletId.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase())}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedWallets.map((walletId) => (
                <span key={walletId} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  {walletId.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^w/, c => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="beneficio" className="mb-6">
          <TabsList className="mb-8 flex justify-center">
            <TabsTrigger value="beneficio">Beneficio</TabsTrigger>
            <TabsTrigger value="interes">Interés</TabsTrigger>
          </TabsList>
          <TabsContent value="beneficio">
            <div className="flex flex-col gap-8">
              <WeeklyCalendar 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                selectedDiscountType={selectedDiscountType}
                onDiscountTypeSelect={handleDiscountTypeSelect}
              />
              <BenefitsGrid 
                selectedWallets={walletFilter ? [walletFilter] : selectedWallets}
                selectedCategory={selectedCategory}
                selectedDiscountType={selectedDiscountType}
                selectedDate={selectedDate}
                onBenefitClick={setSelectedBenefit}
              />
            </div>
          </TabsContent>
          <TabsContent value="interes">
            <InterestWalletsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


export default Index;
