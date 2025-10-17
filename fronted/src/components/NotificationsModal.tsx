import { useEffect, useMemo, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

type DiscountType = "all" | "En cuotas" | "Reintegro" | "Sin tope";

const DISCOUNT_TYPES: { id: DiscountType; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "En cuotas", label: "Cuotas" },
  { id: "Reintegro", label: "Reintegro" },
  { id: "Sin tope", label: "Sin tope" },
];

export interface NotificationsPrefs {
  enabled: boolean;
  minDiscount: number;
  types: DiscountType[]; // multiple allowed, can include "all"
  wallets: string[]; // subset of availableWallets
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (prefs: NotificationsPrefs) => void;
  availableWallets: string[];
}

const STORAGE_KEY = "notifications-prefs";

const NotificationsModal = ({ isOpen, onClose, onSave, availableWallets }: NotificationsModalProps) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedTypes, setSelectedTypes] = useState<DiscountType[]>(["all"]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

  const ensureSubset = useCallback((arr: string[]) => arr.filter((id) => availableWallets.includes(id)), [availableWallets]);

  // Load stored prefs when opening
  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NotificationsPrefs;
        setEnabled(parsed.enabled ?? true);
        setMinDiscount(parsed.minDiscount ?? 0);
        setSelectedTypes(parsed.types && parsed.types.length ? parsed.types : ["all"]);
        setSelectedWallets(ensureSubset(parsed.wallets || availableWallets));
      } else {
        setEnabled(true);
        setMinDiscount(0);
        setSelectedTypes(["all"]);
        setSelectedWallets(availableWallets);
      }
    } catch {
      setEnabled(true);
      setMinDiscount(0);
      setSelectedTypes(["all"]);
      setSelectedWallets(availableWallets);
    }
  }, [isOpen, availableWallets, ensureSubset]);

  // If the available wallets change while open, enforce subset
  useEffect(() => {
    setSelectedWallets((prev) => ensureSubset(prev));
  }, [availableWallets, ensureSubset]);

  const handleToggleType = (id: DiscountType) => {
    setSelectedTypes((prev) => {
      if (id === "all") return ["all"]; // selecting all resets others
      const has = prev.includes(id);
      const next = has ? prev.filter((t) => t !== id) : [...prev.filter((t) => t !== "all"), id];
      return next.length ? next : ["all"]; // never empty
    });
  };

  const handleToggleWallet = (id: string) => {
    if (!availableWallets.includes(id)) return;
    setSelectedWallets((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  };

  const formattedWallets = useMemo(
    () =>
      availableWallets.map((id) => ({
        id,
        label: id.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (c) => c.toUpperCase()),
      })),
    [availableWallets]
  );

  const handleSave = () => {
    const prefs: NotificationsPrefs = {
      enabled,
      minDiscount,
      types: selectedTypes,
      wallets: ensureSubset(selectedWallets.length ? selectedWallets : availableWallets),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    if (onSave) onSave(prefs);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent className="max-w-xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Notificaciones</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable/Disable notifications toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Recibir notificaciones</span>
              <span className="text-xs text-muted-foreground">
                {enabled ? "Recibirás alertas de nuevos beneficios" : "No recibirás notificaciones"}
              </span>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              aria-label="Activar o desactivar notificaciones"
            />
          </div>

          {/* Min discount range */}
          <div className={!enabled ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Mínimo descuento (%)</span>
              <span className="text-sm font-medium">{minDiscount}%</span>
            </div>
            <Slider
              value={[minDiscount]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setMinDiscount(v[0] ?? 0)}
            />
          </div>

          {/* Benefit types */}
          <div className={!enabled ? "opacity-50 pointer-events-none" : ""}>
            <div className="mb-2 text-sm text-muted-foreground">Tipo de beneficio</div>
            <div className="grid grid-cols-2 gap-2">
              {DISCOUNT_TYPES.map((t) => (
                <label key={t.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                  <Checkbox
                    checked={selectedTypes.includes(t.id)}
                    onCheckedChange={() => handleToggleType(t.id)}
                  />
                  <span className="text-sm">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Wallets multi-select */}
          <div className={!enabled ? "opacity-50 pointer-events-none" : ""}>
            <div className="mb-2 text-sm text-muted-foreground">Billeteras</div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {formattedWallets.map((w) => (
                <label key={w.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                  <Checkbox
                    checked={selectedWallets.includes(w.id)}
                    onCheckedChange={() => handleToggleWallet(w.id)}
                  />
                  <span className="text-sm">{w.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;

