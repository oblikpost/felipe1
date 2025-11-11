import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriarVagasPage } from './criar-vagas.page';

const routes: Routes = [
  {
    path: '',
    component: CriarVagasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriarVagasPageRoutingModule {}
