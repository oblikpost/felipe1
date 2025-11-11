import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // 1. Importe o Router
import { BehaviorSubject, Observable } from 'rxjs';

// Interface Vaga (já com ID)
export interface Vaga {
  id: string;
  titulo: string;
  curso: string;
  descricao: string;
  contato: string;
}

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private vagas = new BehaviorSubject<Vaga[]>([]);
  public vagas$: Observable<Vaga[]> = this.vagas.asObservable();

  // 2. NOVO: "Memória" para a vaga que está sendo editada
  private vagaParaEditar = new BehaviorSubject<Vaga | null>(null);
  public vagaParaEditar$ = this.vagaParaEditar.asObservable();

  // 3. Injete o Router
  constructor(private router: Router) {}

  // 4. Método para adicionar (não precisa mais de Omit)
  addVaga(novaVaga: Omit<Vaga, 'id'>) {
    const listaAtual = this.vagas.getValue();
    const idUnico = new Date().getTime().toString();
    const vagaComId: Vaga = { ...novaVaga, id: idUnico };
    const novaLista = [vagaComId, ...listaAtual];
    this.vagas.next(novaLista);
  }

  // 5. NOVO MÉTODO: Carrega a vaga para edição
  carregarVagaParaEdicao(id: string) {
    // Acha a vaga na lista
    const vagaEncontrada = this.vagas.getValue().find((v) => v.id === id);
    if (vagaEncontrada) {
      // Coloca a vaga na "memória" (BehaviorSubject)
      this.vagaParaEditar.next(vagaEncontrada);
      // Navega para a página de criação
      this.router.navigateByUrl('/criar-vagas');
    }
  }

  // 6. NOVO MÉTODO: Limpa a "memória" de edição
  limparEdicao() {
    this.vagaParaEditar.next(null);
  }

  // 7. MÉTODO ATUALIZADO: Implementa a lógica de edição
  editarVaga(vagaAtualizada: Vaga) {
    const lista = this.vagas.getValue();

    // Encontra o índice da vaga antiga
    const index = lista.findIndex((v) => v.id === vagaAtualizada.id);

    if (index > -1) {
      // Substitui a vaga antiga pela nova
      lista[index] = vagaAtualizada;
      // Publica a lista com a vaga atualizada
      this.vagas.next([...lista]);
    }
  }

  excluirVaga(idParaExcluir: string) {
    const listaAtual = this.vagas.getValue();
    const novaLista = listaAtual.filter((vaga) => vaga.id !== idParaExcluir);
    this.vagas.next(novaLista);
  }
}
