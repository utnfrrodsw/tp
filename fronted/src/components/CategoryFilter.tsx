import { Button } from "@/components/ui/button";
import { 
  Grid3X3, 
  Coffee, 
  Flame, 
  Shirt, 
  Baby, 
  Dumbbell, 
  Home, 
  Sparkles, 
  Gamepad2
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: "all",
    name: "Todas",
    icon: <Grid3X3 className="w-4 h-4" />
  },
  {
    id: "food",
    name: "Comida",
    icon: <Coffee className="w-4 h-4" />
  },
  {
    id: "combustible",
    name: "Combustible",
    icon: <Flame className="w-4 h-4" />
  },
  {
    id: "indumentaria",
    name: "Indumentaria",
    icon: <Shirt className="w-4 h-4" />
  },
  {
    id: "ninos",
    name: "Niños",
    icon: <Baby className="w-4 h-4" />
  },
  {
    id: "deporte",
    name: "Deporte",
    icon: <Dumbbell className="w-4 h-4" />
  },
  {
    id: "hogar",
    name: "Hogar",
    icon: <Home className="w-4 h-4" />
  },
  {
    id: "belleza",
    name: "Belleza",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: "entertainment",
    name: "Entretenimiento",
    icon: <Gamepad2 className="w-4 h-4" />
  }
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  selectedDiscountType?: string;
  onDiscountTypeSelect?: (discountType: string) => void;
}

  const discountTypes = [
    { id: "all", label: "Todos" },
    { id: "En cuotas", label: "Cuotas" },
    { id: "Reintegro", label: "Reintegro" },
    { id: "Sin tope", label: "Sin tope" }
  ];

const CategoryFilter = ({ selectedCategory, onCategorySelect, selectedDiscountType = "all", onDiscountTypeSelect }: CategoryFilterProps) => {
  return (
    <div className="w-full flex justify-center mb-4">
      <div className="flex flex-wrap gap-3 items-center max-w-4xl w-full justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center gap-2 transition-all ${
              selectedCategory === category.id
                ? "bg-gradient-primary hover:opacity-90 shadow-lg"
                : "hover:border-primary/50"
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.name}</span>
          </Button>
        ))}

        <div className="ml-2">
          <select
            value={selectedDiscountType}
            onChange={(e) => onDiscountTypeSelect && onDiscountTypeSelect(e.target.value)}
            className="rounded-md border border-input px-3 py-2 bg-card text-card-foreground"
          >
            {discountTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;