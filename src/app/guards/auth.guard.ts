import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isLoggedIn()) {
        return true;
    }

    //not logged in ~ redirect to login with query param for return url
   router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
   });

    return false;
};