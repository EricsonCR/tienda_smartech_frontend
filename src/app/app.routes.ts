import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { HeaderComponent } from './pages/header/header.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './helpers/auth.guard';

export const routes: Routes = [
    { path: "home", redirectTo: "", pathMatch: "full" },
    { path: "", component: HomeComponent },
    { path: "login", component: LoginComponent, canActivate: [authGuard] },
    { path: "productos", component: ProductosComponent },
    { path: "header", component: HeaderComponent }
];