import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Importar LoadingController
import {
  IonicModule,
  AlertController,
  NavController,
  LoadingController,
} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VagasService, Vaga } from '../services/vagas.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ver-vagas',
  templateUrl: './ver-vagas.page.html',
  styleUrls: ['./ver-vagas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class VerVagasPage implements OnInit {
  public vagas$: Observable<Vaga[]>;

  constructor(
    private vagasService: VagasService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController // 2. Injetar LoadingController
  ) {
    this.vagas$ = this.vagasService.vagas$;
  }

  ngOnInit() {}

  // A função de editar (navegar) está correta
  editarVaga(vaga: Vaga) {
    this.vagasService.carregarVagaParaEdicao(vaga.id);
  }

  // 3. Função de exclusão (ATUALIZADA)
  async confirmarExclusao(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: 'Você tem certeza que deseja excluir esta vaga?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          // 4. Transformar o handler em async para usar await
          handler: async () => {
            // 5. Mostrar o loading
            const loading = await this.loadingCtrl.create({
              message: 'A excluir vaga...',
            });
            await loading.present();

            try {
              // 6. Usar await e try/catch
              await this.vagasService.excluirVaga(id);
              await loading.dismiss();
              // Não precisamos de um alerta de sucesso,
              // a vaga simplesmente desaparecerá da lista.
            } catch (error) {
              await loading.dismiss();
              // 7. Mostrar alerta de erro
              this.mostrarAlerta(
                'Erro ao Excluir',
                'Não foi possível excluir a vaga. Verifique as suas permissões no Firestore.'
              );
              console.error('Erro ao excluir:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // 8. Função de alerta genérico
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
