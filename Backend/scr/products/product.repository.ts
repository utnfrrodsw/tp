import { Repository } from "../zshare/repository.js"
import { Product } from "./product.entity.js"


const products = [
  new Product(
    'Alimento',
    'Alimento balanceado para perro',
    100,
    '01'
  ),
];

export class productRepository implements Repository<Product> {
  public findAll(): Product[] | undefined{
    return products
  }

  public findOne(item: {id: string}): Product | undefined{
    return products.find(product => product.id === item.id)
  }
  public add(item: Product): Product | undefined{
    products.push(item)
    return item
  }

  public update(item: Product): Product | undefined{
     const productIdx = products.findIndex((product) => product.id === item.id);
  if (productIdx !== -1) {
    products[productIdx]= {...products[productIdx], ...item };
  }
  return products[productIdx]}

  public delete(item: {id: string}): Product | undefined{
    const productIdx = products.findIndex((product) => product.id === item.id);
    if (productIdx !== -1) {
      const deletedproducts = products[productIdx];
      products.splice(productIdx, 1);
      return deletedproducts;
  }
}
}