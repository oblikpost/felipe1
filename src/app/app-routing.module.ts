import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    // Corrigido para loadComponent (Standalone)
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    // Corrigido para loadComponent (Standalone)
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    // Corrigido para loadComponent (Standalone)
    loadComponent: () =>
      import('./cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: 'cursos',
    // Corrigido para loadComponent (Standalone)
    loadComponent: () =>
      import('./cursos/cursos.page').then((m) => m.CursosPage),
  },
  // ROTA ADICIONADA:
  {
    path: 'criar-vagas',
    loadComponent: () =>
      import('./criar-vagas/criar-vagas.page').then((m) => m.CriarVagasPage),
  },
  // ROTA ADICIONADA:
  {
    path: 'ver-vagas',
    loadComponent: () =>
      import('./ver-vagas/ver-vagas.page').then((m) => m.VerVagasPage),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
