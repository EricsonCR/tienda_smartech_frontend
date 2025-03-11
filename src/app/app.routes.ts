import { Routes } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './helpers/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ProductoDetalleComponent } from './pages/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './pages/menuCompra/carrito/carrito.component';
import { CuentaComponent } from './pages/menuCuenta/cuenta/cuenta.component';
import { cuentaGuard } from './helpers/cuenta.guard';
import { ResumenComponent } from './pages/menuCuenta/resumen/resumen.component';
import { DireccionesComponent } from './pages/menuCuenta/direcciones/direcciones.component';
import { DatosComponent } from './pages/menuCuenta/datos/datos.component';
import { DireccionComponent } from './pages/menuCuenta/direccion/direccion.component';
import { CompraComponent } from './pages/menuCompra/compra/compra.component';
import { EntregaComponent } from './pages/menuCompra/entrega/entrega.component';
import { PagoComponent } from './pages/menuCompra/pago/pago.component';

export const routes: Routes = [
    { path: "home", redirectTo: "", pathMatch: "full" },
    { path: "", component: HomeComponent },
    { path: "header", component: HeaderComponent },
    { path: "login", component: SigninComponent, canActivate: [authGuard] },
    { path: "registrar", component: SignupComponent, canActivate: [authGuard] },
    { path: "recuperarpassword", component: ForgotpasswordComponent },
    { path: "producto-detalle/:nombre", component: ProductoDetalleComponent },
    {
        path: "cuenta", component: CuentaComponent,
        children: [
            { path: "resumen", component: ResumenComponent },
            { path: "datos", component: DatosComponent },
            { path: "direccion", component: DireccionesComponent },
            { path: "direccion/crear", component: DireccionComponent },
            { path: "direccion/editar/:id", component: DireccionComponent }
        ],
        canActivate: [cuentaGuard]
    },
    {
        path: "compra", component: CompraComponent,
        children: [
            { path: "carrito", component: CarritoComponent },
            { path: "entrega", component: EntregaComponent },
            { path: "pago", component: PagoComponent }
        ]
    }
];