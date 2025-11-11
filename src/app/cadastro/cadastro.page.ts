import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Importar AlertController e LoadingController
import {
  IonicModule,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class CadastroPage implements OnInit {
  nomeEmpresa: string = '';
  cnpj: string = '';
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController // 2. Injetar o LoadingController
  ) {}

  ngOnInit() {}

  async register() {
    // 3. Criar e apresentar o "Loading"
    const loading = await this.loadingCtrl.create({
      message: 'A registar...',
      spinner: 'crescent',
    });
    await loading.present();

    // 4. Bloco try...catch...finally
    try {
      const userCred = await this.authService.registerCompany(
        this.email,
        this.senha,
        this.nomeEmpresa,
        this.cnpj
      );

      if (userCred && userCred.user) {
        console.log('Registro bem-sucedido!', userCred.user.uid);
        this.navCtrl.navigateRoot('/home'); // Redireciona para a home
      } else {
        this.showAlert('Erro', 'Ocorreu uma falha inesperada no registro.');
      }
    } catch (error: any) {
      console.error('Falha no registro', error);

      let message = 'Ocorreu um erro inesperado. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está a ser utilizado por outra conta.';
      } else if (error.code === 'auth/weak-password') {
        message =
          'A sua senha é muito fraca. Tente uma senha com pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'O e-mail fornecido não é válido.';
      }

      this.showAlert('Falha no Registro', message);
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
