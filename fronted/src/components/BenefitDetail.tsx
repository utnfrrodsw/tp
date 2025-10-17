import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Timer, DollarSign, Wallet } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { wallets } from "./data/wallets.tsx";

interface BenefitDetailProps {
  benefit: {
    id: string;
    name: string;
    discount: number;
    discountType: string; // New property for discount type
    icon: React.ReactNode;
    category: string;
    walletId: string;
    availableDays: number[];
    validity?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    limit?: string;
    tope_reintegro?: number;
    imageUrl?: string;
  };
  onBack: () => void;
}

const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

const BenefitDetail: React.FC<BenefitDetailProps> = ({ benefit, onBack }) => {
  // Buscar el nombre de la billetera correspondiente
  const wallet = wallets.find(w => w.id === benefit.walletId);
  const walletName = wallet ? wallet.name : benefit.walletId;
  // calcular cuánto hay que gastar para alcanzar el tope de reintegro
  const spendToReachTop = (benefit.tope_reintegro && benefit.discount && benefit.discount > 0)
    ? Math.ceil(benefit.tope_reintegro / (benefit.discount / 100))
    : null;
  return (
    <Dialog.Root open onOpenChange={open => { if (!open) onBack(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#6c4bb6] rounded-2xl shadow-2xl p-0">
          <div className="flex items-center p-4">
            <Dialog.Close asChild>
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-white mr-2" />
                Volver 
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex flex-col items-center -mt-4">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg">
              {wallet?.image ? (
                <img
                  src={wallet.image}
                  alt={walletName}
                  className="w-24 h-24 object-contain mix-blend-multiply"
                />
              ) : benefit.imageUrl ? (
                <img src={benefit.imageUrl} alt={benefit.name} className="w-28 h-28 rounded-full object-cover" />
              ) : (
                benefit.icon
              )}
            </div>
          </div>
          <Card className="bg-card rounded-t-3xl mt-6 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              {benefit.discountType?.toLowerCase().includes("cuota")
                ? `¡Aprovechá ${benefit.discount} cuotas con ${walletName}!`
                : benefit.discountType?.toLowerCase().includes("reintegro")
                  ? `¡Aprovechá ${benefit.discount}% de reintegro con ${walletName}!`
                  : `¡Aprovechá ${benefit.discount}% OFF con ${walletName}!`}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Usalo los días</span>
                <div className="flex gap-1 ml-2">
                  {dayLabels.map((label, idx) => {
                    // calendar uses idx 0 = Monday ... 6 = Sunday
                    // benefit.availableDays uses date-fns getDay convention: 0 = Sunday ... 6 = Saturday
                    const mappedDay = (idx + 1) % 7; // Monday->1, ..., Sunday->0
                    const isAvailable = benefit.availableDays.includes(mappedDay);
                    return (
                      <span
                        key={label}
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${isAvailable ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Vigencia</span>
                <span className="ml-2 text-sm text-foreground">{benefit.fecha_hasta || "Consultar condiciones"}</span>
              
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Tope de reintegro</span>
                  <span className="ml-2 text-sm text-foreground">
                    {benefit.tope_reintegro
                      ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(benefit.tope_reintegro)
                      : benefit.limit || "Consultar condiciones"}
                  </span>
                </div>

                {benefit.discountType?.toLowerCase().includes("reintegro") && benefit.tope_reintegro && spendToReachTop && (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Aprovechá el descuento al máximo gastando hasta</span>
                    <span className="ml-2 text-sm font-semibold text-foreground">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(spendToReachTop)}
                    </span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full">Términos y condiciones</Button>
            </div>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BenefitDetail;




