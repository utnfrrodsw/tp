export class Adoption{
  constructor(
    public comments: string, 
    public id_animal: number,
    public id_person: number,
    public adoption_date: Date,
    public id?: number,
  ){}
}
