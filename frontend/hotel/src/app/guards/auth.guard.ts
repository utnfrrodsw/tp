import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../service/empleados.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const empleadosService = inject(EmpleadosService);

  
  const isEmployee = empleadosService.isEmployeeLoggedIn();

  if (isEmployee) {
    
    router.navigate(['/dashboard/empleado']);
    return false; 
  }

  
  return true; 
};

