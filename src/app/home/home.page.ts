import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoursesSectionComponent } from '../components/courses-section/courses-section.component';
// Importamos a Interface E o Serviço
import { AuthService, CompanyProfile } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule, // Necessário para *ngIf e o pipe 'async'
    FormsModule,
    CoursesSectionComponent,
    RouterModule,
  ],
})
export class HomePage {
  // Declaramos os Observables que o HTML vai usar
  companyProfile$: Observable<CompanyProfile | null>;
  isLoggedIn$: Observable<boolean>; // <-- ADICIONADO

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    // Atribuímos os observables do serviço às nossas variáveis locais
    this.companyProfile$ = this.authService.companyProfile$;
    this.isLoggedIn$ = this.authService.isLoggedIn$; // <-- ADICIONADO
  }

  // Função de logout
  logout() {
    this.authService.logout().subscribe(() => {
      this.navCtrl.navigateRoot('/home');
    });
  }
}
