import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AdminService } from "./admin.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AdminGuard implements CanActivate {
    constructor(private adminService: AdminService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.adminService.canActivate();
    }
}