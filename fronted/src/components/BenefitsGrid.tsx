import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  ShoppingCart, 
  Car, 
  Pizza, 
  Gamepad2, 
  BookOpen,
  Music,
  Plane,
  Hotel
} from "lucide-react";
import { format, getDay } from "date-fns";

import { wallets } from "./data/wallets.tsx";
interface Benefit {
  id: string;
  name: string;
  discount: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  icon: React.ReactNode;
  category: string;
  walletId: string;
  availableDays: number[]; // 0 = domingo, 1 = lunes, etc.
  discountType?: string;
  tope_reintegro?: number;
}

const benefits: Benefit[] = [
  {
    id: "starbucks",
    name: "wallet a",
    discount: 25,
    icon: <Coffee className="w-8 h-8" />,
    category: "belleza",
    walletId: "mercadopago",
    availableDays: [1, 2, 5],
    fecha_hasta: "2024-12-31",
    fecha_desde: "2024-01-01",
    discountType: "Sin tope"
  },
  {
    id: "starbucks",
    name: "camilo",
    discount: 12,
    icon: <Gamepad2 className="w-8 h-8" />,
    category: "hogar",
    walletId: "mercadopago",
    availableDays: [1, 3,4, 5,6],
    fecha_desde: "2025-08-15",
    fecha_hasta: "2025-12-31",
    discountType: "En cuotas"
  },
  {
    id: "mcdonalds",
    name: "McDonald's",
    discount: 30,
    icon: <Pizza className="w-8 h-8" />,
    category: "Music",
    walletId: "mercadopago",
    availableDays: [0, 6],
    fecha_desde: "2025-01-01",
    fecha_hasta: "2025-12-31",
  discountType: "Reintegro",
  tope_reintegro: 5000
  },
  {
    id: "uber",
    name: "Uber",
    discount: 20,
    icon: <Car className="w-8 h-8" />,
    category: "transport",
    walletId: "rapipago",
    availableDays: [1, 2, 3, 4, 5],
    fecha_desde: "2025-09-15",
    fecha_hasta: "2025-10-15",
    discountType: "Sin tope"
  },
  {
    id: "steam",
    name: "Steam",
    discount: 45,
    icon: <Gamepad2 className="w-8 h-8" />,
    category: "entertainment",
    walletId: "uala",
    availableDays: [5, 6, 0],
    fecha_desde: "2025-06-01",
    fecha_hasta: "2025-09-20",
    discountType: "En cuotas"
  },
  {
    id: "spotify",
    name: "Spotify",
    discount: 50,
    icon: <Music className="w-8 h-8" />,
    category: "deporte",
    walletId: "pagofacil",
    availableDays: [0, 2, 3, 4, 5, 6],
    fecha_desde: "2025-09-10",
    fecha_hasta: "2025-09-30",
    discountType: "Sin tope"
  },
  {
    id: "amazon",
    name: "Amazon",
    discount: 15,
    icon: <ShoppingCart className="w-8 h-8" />,
    category: "shopping",
    walletId: "mercadopago",
    availableDays: [1, 3, 5],
    fecha_desde: "2025-11-01",
    fecha_hasta: "2025-12-31",
  discountType: "Reintegro",
  tope_reintegro: 16000
  },
  {
    id: "booking",
    name: "Booking.com",
    discount: 35,
    icon: <Hotel className="w-8 h-8" />,
    category: "travel",
    walletId: "rapipago",
    availableDays: [0, 6],
    fecha_desde: "2025-07-01",
    fecha_hasta: "2025-09-18",
    discountType: "En cuotas"
  },
  {
    id: "coursera",
    name: "Coursera",
    discount: 40,
    icon: <BookOpen className="w-8 h-8" />,
    category: "education",
    walletId: "uala",
    availableDays: [1, 2, 3, 4],
    fecha_desde: "2025-01-01",
    fecha_hasta: "2025-03-31",
    discountType: "Sin tope"
  },
  {
    id: "latam",
    name: "LATAM Airlines",
    discount: 25,
    icon: <Plane className="w-8 h-8" />,
    category: "travel",
    walletId: "pagofacil",
    availableDays: [2, 4],
    fecha_desde: "2025-09-14",
    fecha_hasta: "2025-09-21",
  discountType: "Reintegro",
  tope_reintegro: 5000
  },
  {
    id: "burguer-king",
    name: "Burger King",
    discount: 35,
    icon: <Pizza className="w-8 h-8" />,
    category: "food",
    walletId: "cuenta-dni",
    availableDays: [0, 6],
    fecha_desde: "2025-09-01",
    fecha_hasta: "2025-12-31",
    discountType: "Sin tope"
  },
  {
    id: "netflix",
    name: "Netflix",
    discount: 8,
    icon: <Music className="w-8 h-8" />,
    category: "entertainment",
    walletId: "brubank",
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    fecha_desde: "2025-01-01",
    fecha_hasta: "2025-12-31",
    discountType: "En cuotas"
  },
  {
    id: "cabify",
    name: "Cabify",
    discount: 25,
    icon: <Car className="w-8 h-8" />,
    category: "transport",
    walletId: "modo",
    availableDays: [1, 2, 3, 4, 5],
    fecha_desde: "2025-09-10",
    fecha_hasta: "2025-09-25",
  discountType: "Reintegro",
  tope_reintegro: 5000
  }
];

interface BenefitsGridProps {
  selectedWallets: string[];
  selectedCategory: string;
  selectedDiscountType?: string;
  selectedDate: Date;
  onBenefitClick?: (benefit: Benefit) => void;
}

const BenefitsGrid = ({ selectedWallets, selectedCategory, selectedDiscountType = "all", selectedDate, onBenefitClick }: BenefitsGridProps) => {
  const selectedDayOfWeek = getDay(selectedDate);
  const filteredBenefits = benefits.filter(benefit => {
    const walletMatch = selectedWallets.includes(benefit.walletId);
    const categoryMatch = selectedCategory === "all" || benefit.category === selectedCategory;
    const dayMatch = benefit.availableDays.includes(selectedDayOfWeek);
    const discountTypeMatch = selectedDiscountType === "all" || (benefit.discountType && benefit.discountType.toLowerCase().includes(selectedDiscountType.toLowerCase()));
    return walletMatch && categoryMatch && dayMatch && discountTypeMatch;
  });

  const getDiscountColor = (discount: number) => {
    if (discount >= 40) return "bg-green-500";
    if (discount >= 25) return "bg-yellow-500";
    if (discount >= 15) return "bg-red-600";
    return "bg-blue-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBenefits.map((benefit) => (
        <Card
          key={benefit.id}
          className="p-6 hover:scale-105 transition-all cursor-pointer group bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
          onClick={() => onBenefitClick && onBenefitClick(benefit)}
        >
            <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center group-hover:animate-float">
              <div className="text-primary">
                {wallets.find(w => w.id === benefit.walletId)?.image ? (
                  <img
                    src={wallets.find(w => w.id === benefit.walletId)!.image as string}
                    alt={wallets.find(w => w.id === benefit.walletId)!.name}
                    className="w-10 h-10 object-contain mix-blend-multiply"
                  />
                ) : (
                  wallets.find(w => w.id === benefit.walletId)?.icon || benefit.icon
                )}
              </div>
            </div>
            {/* el nombre de benefico asociado a la wallet con logo */ }
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <h3 className="font-bold text-lg text-card-foreground">
                  {wallets.find(w => w.id === benefit.walletId)?.name || benefit.walletId}
                </h3>
              </div>
            {/* cambie en funcion del tipo de descuento descuento*/ }

              <Badge className={`${getDiscountColor(benefit.discount)} text-white font-bold text-lg px-4 py-2`}>
                {benefit.discountType?.toLowerCase().includes("cuota")
                
                  ? `${benefit.discount} cuotas`
                  : benefit.discountType?.toLowerCase().includes("reintegro")
                    ? `Reintegro ${benefit.discount}%`
                    : benefit.discountType?.toLowerCase().includes("sin tope")
                      ? `${benefit.discount}% OFF`
                  : `${benefit.discount}% OFF`}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground capitalize">
              {/* Aquí va el tipo de descuento, por ejemplo: "Reintegro", "Sin tope", "En cuotas" */}
              {/* Puedes agregar una propiedad "discountType" al objeto Benefit y mostrarla aquí */}
              {benefit.discountType }
            </div>
            </div>
          </Card>
          ))}
          
          {filteredBenefits.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground text-lg">
            No hay beneficios disponibles para {['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][getDay(selectedDate)]}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Selecciona otro día u otra categoría para ver más ofertas
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsGrid;

