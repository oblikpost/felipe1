import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. Importar LoadingController e AlertController
import {
  IonicModule,
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VagasService, Vaga, VagaInput } from '../services/vagas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-criar-vagas',
  templateUrl: './criar-vagas.page.html',
  styleUrls: ['./criar-vagas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class CriarVagasPage implements OnInit, OnDestroy {
  public vagaData: Partial<Vaga> = {
    titulo: '',
    curso: '',
    descricao: '',
    contato: '',
  };

  public isEditMode = false;
  private idVagaAtual: string | null = null;
  private editSub: Subscription | undefined;

  public cursosList = [
    'Administração',
    'Informática para Internet',
    'Design Gráfico',
    'Eletrônica',
    'Serviços Jurídicos',
    'Comércio Exterior',
    'Ciências da Natureza',
    'Desenvolvimento de Sistemas',
  ];

  constructor(
    private navCtrl: NavController,
    private vagasService: VagasService,
    private loadingCtrl: LoadingController, // 2. Injetar LoadingController
    private alertCtrl: AlertController // 3. Injetar AlertController
  ) {}

  ngOnInit() {
    this.editSub = this.vagasService.vagaParaEditar$.subscribe((vaga) => {
      if (vaga) {
        this.isEditMode = true;
        this.idVagaAtual = vaga.id;
        this.vagaData = { ...vaga };
      } else {
        this.isEditMode = false;
        this.idVagaAtual = null;
        this.resetarFormulario();
      }
    });
  }

  ngOnDestroy() {
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
    this.vagasService.limparEdicao();
  }

  // 4. Função salvarVaga (ATUALIZADA)
  async salvarVaga() {
    // 5. Mostrar o loading
    const loading = await this.loadingCtrl.create({
      message: this.isEditMode
        ? 'A salvar alterações...'
        : 'A publicar vaga...',
    });
    await loading.present();

    try {
      if (this.isEditMode && this.idVagaAtual) {
        // Lógica de EDIÇÃO
        await this.vagasService.editarVaga(this.vagaData as Vaga);
      } else {
        // Lógica de CRIAÇÃO
        const vagaInput: VagaInput = {
          titulo: this.vagaData.titulo!,
          curso: this.vagaData.curso!,
          descricao: this.vagaData.descricao!,
          contato: this.vagaData.contato!,
        };
        await this.vagasService.addVaga(vagaInput);
      }

      await loading.dismiss();
      this.resetarFormulario();
      this.navCtrl.navigateBack('/ver-vagas'); // Volta para a lista
    } catch (e) {
      // 6. Tratar o erro
      await loading.dismiss();
      this.mostrarAlerta(
        'Erro ao Salvar',
        'Não foi possível salvar a vaga. Verifique as suas permissões no Firestore.'
      );
      console.error('Erro ao salvar vaga:', e);
    }
  }

  resetarFormulario() {
    this.vagaData = {
      titulo: '',
      curso: '',
      descricao: '',
      contato: '',
    };
  }

  // 7. Função de alerta genérico
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
