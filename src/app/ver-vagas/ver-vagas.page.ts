import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, NavController } from '@ionic/angular'; // 1. Importe NavController
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
    private navCtrl: NavController // 2. Injete NavController
  ) {
    this.vagas$ = this.vagasService.vagas$;
  }

  ngOnInit() {}

  // 3. FUNÇÃO EDITAR ATUALIZADA
  editarVaga(vaga: Vaga) {
    // Em vez de chamar o serviço de edição,
    // chamamos o serviço para carregar a vaga e navegar
    this.vagasService.carregarVagaParaEdicao(vaga.id);
  }

  // 4. Função de exclusão (permanece a mesma)
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
          handler: () => {
            this.vagasService.excluirVaga(id);
          },
        },
      ],
    });
    await alert.present();
  }
}
