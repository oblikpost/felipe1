import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CriarVagasPageRoutingModule } from './criar-vagas-routing.module';

import { CriarVagasPage } from './criar-vagas.page'; // Página é importada

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriarVagasPageRoutingModule,
    CriarVagasPage, // <--- ADICIONE A PÁGINA AQUI (nos imports)
  ],
  // declarations: [CriarVagasPage] // <--- REMOVA OU COMENTE ESTA LINHA
})
export class CriarVagasPageModule {}
