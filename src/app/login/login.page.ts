import { Component, OnInit } from '@angular/core';
// 1. Importar AlertController e LoadingController
import {
  IonicModule,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class LoginPage implements OnInit {
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController // 2. Injetar LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    // 3. Criar e apresentar o "Loading"
    const loading = await this.loadingCtrl.create({
      message: 'A entrar...',
      spinner: 'crescent',
    });
    await loading.present();

    // 4. Bloco try...catch...finally
    try {
      const userCred = await this.authService.login(this.email, this.senha);

      if (userCred && userCred.user) {
        console.log('Login bem-sucedido!', userCred.user.uid);
        this.navCtrl.navigateRoot('/home'); // Redireciona para a home
      } else {
        this.showAlert('Erro', 'Ocorreu uma falha inesperada no login.');
      }
    } catch (error: any) {
      console.error('Falha no login', error);

      let message = 'Ocorreu um erro inesperado. Tente novamente.';

      if (
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        message =
          'E-mail ou senha incorretos. Por favor, verifique e tente novamente.';
      }

      this.showAlert('Falha no Login', message);
    } finally {
      // 5. Garantir que o loading desaparece
      await loading.dismiss();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
