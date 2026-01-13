import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export function roleGuard(allowedRoles: string[]): CanActivateFn {

    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isLoggedIn()) {
            router.navigate(['/login'], {
                queryParams: {returnUrl: state.url}
            });
            return false;
        }

        //Check ~ do they have the required role to have access?
        const currentUser = authService.getCurrentUser();

        if (currentUser && allowedRoles.includes(currentUser.role)){
            return true;
        }

        //else logged in but wrong role sir!
        router.navigate(['/']);
        return false;
    };
} 

export const adminGuard: CanActivateFn = roleGuard(['Admin']);