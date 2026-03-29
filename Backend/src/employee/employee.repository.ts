import { Repository } from '../shared/repository.js'
import { Employee } from './employee.entity.js'

const employees = [
  new Employee(
    "Ricardo Tabacman",
    "testcrud@example.com",
    "+54 341 11111111",
    "ejemplo 123",
    100000,

    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class EmployeeRepository implements Repository<Employee> {
  public findAll(): Employee[] | undefined {
    return employees
  }

  public findOne(item: { id: string }): Employee | undefined {
    return employees.find((employee) => employee.id === item.id)
  }

  public add(item: Employee): Employee | undefined {
    employees.push(item)
    return item
  }

  public update(item: Employee): Employee | undefined {
    const employeeIdx = employees.findIndex((employee) => employee.id === item.id)

    if (employeeIdx !== -1) {
      employees[employeeIdx] = { ...employees[employeeIdx], ...item }
    }
    return employees[employeeIdx]
  }

  public delete(item: { id: string }): Employee | undefined {
    const employeeIdx = employees.findIndex((employee) => employee.id === item.id)

    if (employeeIdx !== -1) {
      const deletedEmployees = employees[employeeIdx]
      employees.splice(employeeIdx, 1)
      return deletedEmployees
    }
  }
}