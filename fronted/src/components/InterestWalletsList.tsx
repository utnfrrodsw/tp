import { wallets } from "./data/wallets.tsx";

const InterestWalletsList = () => {
  // Ordenar de mayor a menor interés
  const sortedWallets = [...wallets].sort((a, b) => b.interes - a.interes);

  return (
    <div className="flex flex-col gap-4">
      {sortedWallets.map((wallets) => (
        <div key={wallets.id} className="flex items-center justify-between p-4 rounded-lg bg-muted shadow">
          <div className="flex items-center gap-3">
            {wallets.image ? (
              <img src={wallets.image} alt={wallets.name} className="w-6 h-6 object-contain " />
            ) : (
              wallets.icon
            )}
            <span className="font-semibold text-lg">{wallets.name}</span>
          </div>
          <span className="text-primary font-bold text-xl">{wallets.interes}%</span>
        </div>
      ))}
    </div>
  );
};

export default InterestWalletsList;
