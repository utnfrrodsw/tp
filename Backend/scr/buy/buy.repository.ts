import { Repository } from "../zshare/repository.js";
import { Buy } from "./buy.entity.js";

const buys = [
  new Buy(
    10000,
    12,
    '12/12/2022',
    '12',
)];

export class BuyRepository implements Repository<Buy> {
  public findAll(): Buy[] | undefined{
    return buys
  }

  public findOne(item: {id: string}): Buy | undefined{
    return buys.find(buy => buy.id === item.id)
  }
  public add(item: Buy): Buy | undefined{
    buys.push(item)
    return item
  }

  public update(item: Buy): Buy | undefined{
     const buyIdx = buys.findIndex((buy) => buy.id === item.id);
  if (buyIdx !== -1) {
    buys[buyIdx]= {...buys[buyIdx], ...item };
  }
  return buys[buyIdx]}

  public delete(item: {id: string}): Buy | undefined{
    const buyIdx = buys.findIndex((buy) => buy.id === item.id);
    if (buyIdx !== -1) {
      const deletedbuys = buys[buyIdx];
      buys.splice(buyIdx, 1);
      return deletedbuys;
  }
}
}