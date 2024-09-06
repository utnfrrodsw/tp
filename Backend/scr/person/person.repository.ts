import { Repository } from "../zshare/repository.js";
import { Person } from "./person.entity.js";


const people = [
  new Person(
    'person',
    'Falsa',
    'DNI',
    23213213,
    'telefono falso',
    '01/02/2002',
    'calle falsa',
    23213213342,
    '01'
  ),
];


export class PersonRepository implements Repository<Person> {

  public findAll(): Person[] | undefined{
    return people
  }

  public findOne(item: {id: string}): Person | undefined{
    return people.find(person => person.id === item.id)
  }
  public add(item: Person): Person | undefined{
    people.push(item)
    return item
  }

  public update(item: Person): Person | undefined{
     const personIdx = people.findIndex((person) => person.id === item.id);
  if (personIdx !== -1) {
    people[personIdx]= {...people[personIdx], ...item };
  }
  return people[personIdx]}

  public delete(item: {id: string}): Person | undefined{
    const personIdx = people.findIndex((person) => person.id === item.id);
    if (personIdx !== -1) {
      const deletedpeople = people[personIdx];
      people.splice(personIdx, 1);
      return deletedpeople;
  }
}
}