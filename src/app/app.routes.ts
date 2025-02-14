import { Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './helpers/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle.component';
import { ProductoDescripcionComponent } from './pages/producto-descripcion/producto-descripcion.component';
import { ProductoEspecificacionComponent } from './pages/producto-especificacion/producto-especificacion.component';
import { ProductoCambioDevolucionComponent } from './pages/producto-cambio-devolucion/producto-cambio-devolucion.component';

export const routes: Routes = [
    { path: "home", redirectTo: "", pathMatch: "full" },
    { path: "", component: HomeComponent },
    { path: "login", component: SigninComponent, canActivate: [authGuard] },
    { path: "registrar", component: SignupComponent },
    { path: "recuperarpassword", component: ForgotpasswordComponent },
    { path: "productos", component: ProductosComponent },
    {
        path: "producto-detalle/:nombre", component: ProductoDetalleComponent,
        children: [
            { path: "descripcion", component: ProductoDescripcionComponent },
            { path: "especificacion", component: ProductoEspecificacionComponent },
            { path: "cambio-devolucion", component: ProductoCambioDevolucionComponent }
        ]
    },
    { path: "header", component: HeaderComponent }
];