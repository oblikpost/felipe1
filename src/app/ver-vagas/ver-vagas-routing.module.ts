import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerVagasPage } from './ver-vagas.page';

const routes: Routes = [
  {
    path: '',
    component: VerVagasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerVagasPageRoutingModule {}
