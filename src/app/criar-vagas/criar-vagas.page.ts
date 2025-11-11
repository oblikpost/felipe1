import { Component, OnInit, OnDestroy } from '@angular/core'; // 1. Importe OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VagasService, Vaga } from '../services/vagas.service';
import { Subscription } from 'rxjs'; // 2. Importe Subscription

@Component({
  selector: 'app-criar-vagas',
  templateUrl: './criar-vagas.page.html',
  styleUrls: ['./criar-vagas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
// 3. Implemente OnDestroy
export class CriarVagasPage implements OnInit, OnDestroy {
  // 4. Modelo de dados (agora pode ter um ID)
  public vagaData: Partial<Vaga> = {
    // Usamos Partial pois o ID só existe na edição
    titulo: '',
    curso: '',
    descricao: '',
    contato: 'contato@futurotec.com',
  };

  // 5. Novas variáveis de controle
  public isEditMode = false;
  private idVagaAtual: string | null = null;
  private editSub: Subscription | undefined; // Para gerenciar a inscrição

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
    private vagasService: VagasService
  ) {}

  ngOnInit() {
    // 6. Ouve o serviço para saber se é modo de edição
    this.editSub = this.vagasService.vagaParaEditar$.subscribe((vaga) => {
      if (vaga) {
        // MODO EDIÇÃO
        this.isEditMode = true;
        this.idVagaAtual = vaga.id;
        this.vagaData = { ...vaga }; // Preenche o formulário com dados da vaga
      } else {
        // MODO CRIAÇÃO
        this.isEditMode = false;
        this.idVagaAtual = null;
        this.resetarFormulario();
      }
    });
  }

  // 7. NOVO MÉTODO: Limpa o componente ao sair
  ngOnDestroy() {
    // Desinscreve-se para evitar vazamento de memória
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
    // Limpa a vaga da "memória" do serviço
    this.vagasService.limparEdicao();
  }

  // 8. Renomeado de criarVaga para salvarVaga
  salvarVaga() {
    if (this.isEditMode && this.idVagaAtual) {
      // Lógica de EDIÇÃO
      console.log('Salvando alterações na vaga:', this.idVagaAtual);
      this.vagasService.editarVaga(this.vagaData as Vaga);
    } else {
      // Lógica de CRIAÇÃO
      console.log('Publicando nova vaga...');
      this.vagasService.addVaga(this.vagaData as Omit<Vaga, 'id'>);
    }

    this.resetarFormulario();
    this.navCtrl.navigateBack('/ver-vagas'); // Volta para a lista
  }

  resetarFormulario() {
    this.vagaData = {
      titulo: '',
      curso: '',
      descricao: '',
      contato: 'contato@futurotec.com',
    };
  }
}
