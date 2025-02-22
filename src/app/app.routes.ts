import { Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './helpers/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { ResumenCuentaComponent } from './pages/resumen-cuenta/resumen-cuenta.component';
import { DatosCuentaComponent } from './pages/datos-cuenta/datos-cuenta.component';

export const routes: Routes = [
    { path: "home", redirectTo: "", pathMatch: "full" },
    { path: "", component: HomeComponent },
    { path: "header", component: HeaderComponent },
    { path: "login", component: SigninComponent, canActivate: [authGuard] },
    { path: "registrar", component: SignupComponent },
    { path: "recuperarpassword", component: ForgotpasswordComponent },
    { path: "productos", component: ProductosComponent },
    { path: "producto-detalle/:nombre", component: ProductoDetalleComponent },
    { path: "carrito", component: CarritoComponent },
    {
        path: "cuenta", component: CuentaComponent,
        children: [
            { path: "resumen", component: ResumenCuentaComponent },
            { path: "datos", component: DatosCuentaComponent }
        ]
    }
];