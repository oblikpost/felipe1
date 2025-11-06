import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CadastroPageRoutingModule } from './cadastro-routing.module';
// Não precisa importar a CadastroPage aqui

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CadastroPageRoutingModule],
  // A linha 'declarations' deve ser removida ou estar vazia
})
export class CadastroPageModule {}
