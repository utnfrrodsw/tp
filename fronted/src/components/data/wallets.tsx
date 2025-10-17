import React from "react";
import { Wallet as WalletIcon, CreditCard, Smartphone } from "lucide-react";

const walletImage = (file: string): string =>
  `${import.meta.env.BASE_URL}wallets/iconos-billeteras/${file}`;

export const wallets = [
  { id: "mercadopago", name: "Mercado Pago", icon: <WalletIcon className="w-6 h-6" />, image: walletImage("mercado-pago-logo-0-1-2048x2048.png"), color: "from-black-500 to-black-500", interes: 45.2 },
  { id: "banco galicia", name: "Banco Galicia", icon: <CreditCard className="w-6 h-6" />, image: walletImage("banco-galicia-logo.svg"), color: "from-red-500 to-red-600", interes: 38.5 },
  { id: "pagofacil", name: "Pago Facil", icon: <Smartphone className="w-6 h-6" />, color: "from-green-500 to-green-600", interes: 41.0 },
  { id: "uala", name: "Uala", icon: <CreditCard className="w-6 h-6" />, color: "from-purple-500 to-purple-600", interes: 47.8 },
  { id: "cuenta-dni", name: "Cuenta DNI", icon: <WalletIcon className="w-6 h-6" />, image: walletImage("cuenta-dni-banco-provincia-logo-png_seeklogo-444642.png"), color: "from-orange-500 to-orange-600", interes: 50.0 },
  { id: "brubank", name: "Brubank", icon: <CreditCard className="w-6 h-6" />, color: "from-indigo-500 to-indigo-600", interes: 44.3 },
  { id: "modo", name: "MODO", icon: <Smartphone className="w-6 h-6" />, image: walletImage("modo-seeklogo.png"), color: "from-pink-500 to-pink-600", interes: 39.9 },
  { id: "personal-pay", name: "Personal Pay", icon: <WalletIcon className="w-6 h-6" />, image: walletImage("personal pay.png"), color: "from-cyan-500 to-cyan-600", interes: 42.7 }
];

export type WalletData = typeof wallets[number];

export default wallets;

