import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VerVagasPageRoutingModule } from './ver-vagas-routing.module';

import { VerVagasPage } from './ver-vagas.page'; // Página é importada

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerVagasPageRoutingModule,
    VerVagasPage, // <--- ADICIONE A PÁGINA AQUI (nos imports)
  ],
  // declarations: [VerVagasPage] // <--- REMOVA OU COMENTE ESTA LINHA
})
export class VerVagasPageModule {}
