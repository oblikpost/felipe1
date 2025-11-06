import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
// Não precisa importar a LoginPage aqui

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LoginPageRoutingModule],
  // A linha 'declarations' deve ser removida ou estar vazia
})
export class LoginPageModule {}
