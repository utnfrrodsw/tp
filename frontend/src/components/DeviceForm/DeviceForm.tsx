import { useState } from "react";
import {
  Smartphone,
  Monitor,
  Laptop,
  Printer,
  Tv,
  Tablet,
  Gamepad2,
  MoreHorizontal,
} from "lucide-react";
import styles from "./DeviceForm.module.css";


interface DeviceTypeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const DEVICE_TYPES: DeviceTypeOption[] = [
  { value: "celular", label: "Teléfono", icon: Smartphone },
  { value: "computadora", label: "Computadora", icon: Monitor },
  { value: "notebook", label: "Notebook", icon: Laptop },
  { value: "impresora", label: "Impresora", icon: Printer },
  { value: "televisor", label: "Televisor", icon: Tv },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "consola", label: "Consola", icon: Gamepad2 },
  { value: "otro", label: "Otro", icon: MoreHorizontal },
];

const BRAND_SUGGESTIONS = [
  "Apple",
  "Samsung",
  "Motorola",
  "Xiaomi",
  "LG",
  "Sony",
  "HP",
  "Dell",
  "Lenovo",
  "Asus",
  "Acer",
  "Epson",
  "Nintendo",
  "PlayStation",
  "Xbox",
];


export interface DeviceFormValues {
  deviceType: string;
  deviceTypeOther: string;
  brand: string;
  model: string;
  observations: string;
}

interface DeviceFormProps {
  values: DeviceFormValues;
  onChange: (values: DeviceFormValues) => void;
}


const DeviceForm = ({ values, onChange }: DeviceFormProps) => {
  const [showOtherInput, setShowOtherInput] = useState(values.deviceType === "otro");

  const handleSelectType = (value: string) => {
    setShowOtherInput(value === "otro");
    onChange({ ...values, deviceType: value });
  };

  return (
    <div className={styles.form}>
      <div className={styles.group}>
        <label className={styles.label}>
          Tipo de dispositivo <span className={styles.required}>*</span>
        </label>

        <div className={styles.typeGrid}>
          {DEVICE_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              className={`${styles.typeOption} ${
                values.deviceType === value ? styles.typeOptionSelected : ""
              }`}
              onClick={() => handleSelectType(value)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {showOtherInput && (
          <input
            type="text"
            className={styles.input}
            placeholder="Especificá el tipo de dispositivo"
            value={values.deviceTypeOther}
            onChange={(e) => onChange({ ...values, deviceTypeOther: e.target.value })}
          />
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="brand" className={styles.label}>
            Marca <span className={styles.required}>*</span>
          </label>
          <input
            id="brand"
            type="text"
            list="brand-suggestions"
            className={styles.input}
            placeholder="Ej: Samsung"
            value={values.brand}
            onChange={(e) => onChange({ ...values, brand: e.target.value })}
          />
          <datalist id="brand-suggestions">
            {BRAND_SUGGESTIONS.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </div>

        <div className={styles.group}>
          <label htmlFor="model" className={styles.label}>
            Modelo/Número de modelo <span className={styles.required}>*</span>
          </label>
          <input
            id="model"
            type="text"
            className={styles.input}
            placeholder="Ej: iPhone 15 Pro"
            value={values.model}
            onChange={(e) => onChange({ ...values, model: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="observations" className={styles.label}>
          Observaciones
        </label>
        <textarea
          id="observations"
          className={styles.textarea}
          placeholder="Detalles adicionales sobre el equipo (rayones, accesorios, estado general, etc.)"
          rows={3}
          value={values.observations}
          onChange={(e) => onChange({ ...values, observations: e.target.value })}
        />
      </div>
    </div>
  );
};

export default DeviceForm;