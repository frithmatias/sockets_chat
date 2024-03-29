import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { UsuarioGuard } from './guards/usuario-guard.service';

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'mensajes', canActivate: [UsuarioGuard], component: MensajesComponent },
  { path: '**', component: LoginComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( appRoutes )
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
