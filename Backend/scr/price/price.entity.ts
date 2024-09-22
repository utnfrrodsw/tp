export class Price{
  constructor(
    public amount: number, 
    public date: Date,
    public id_product: number,
    public id?: number,
  ){}
}
