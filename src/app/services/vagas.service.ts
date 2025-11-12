import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  docData,
} from '@angular/fire/firestore';
import { AuthService, CompanyProfile } from './auth.service';

// Interface Vaga (COM CURSO)
export interface Vaga {
  id: string;
  titulo: string;
  curso: string; // <-- ADICIONADO AQUI
  descricao: string;
  contato: string;
  empresaNome: string;
  empresaUid: string;
  criadaEm: Date;
}

// Omit<Vaga, 'id'> significa "tudo da Vaga, exceto o id"
export type VagaInput = Omit<
  Vaga,
  'id' | 'empresaNome' | 'empresaUid' | 'criadaEm'
>;

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  // Injeção moderna de serviços
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  // Observable que armazena a lista de vagas da empresa logada
  public vagas$: Observable<Vaga[]>;

  // "Memória" para a vaga que está sendo editada
  private vagaParaEditar = new BehaviorSubject<Vaga | null>(null);
  public vagaParaEditar$ = this.vagaParaEditar.asObservable();

  constructor() {
    // Este observable agora reage ao estado de autenticação
    this.vagas$ = this.authService.isLoggedIn$.pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn && this.authService.auth.currentUser) {
          const user = this.authService.auth.currentUser;
          // Se está logado, busca as vagas ONDE o empresaUid é igual ao UID do user
          const vagasCollection = collection(this.firestore, 'vagas');
          const q = query(
            vagasCollection,
            where('empresaUid', '==', user.uid),
            orderBy('criadaEm', 'desc') // Ordena pelas mais recentes
          );
          // collectionData já retorna um Observable<Vaga[]>
          return collectionData(q, { idField: 'id' }) as Observable<Vaga[]>;
        } else {
          // Se não está logado, retorna um array vazio
          return of([]);
        }
      })
    );
  }

  // Adiciona uma nova vaga
  async addVaga(novaVaga: VagaInput) {
    // 1. Pega o perfil da empresa logada (do authService)
    const profile = await this.authService.companyProfile$
      .pipe(first())
      .toPromise();
    const user = this.authService.auth.currentUser;

    if (!profile || !user) {
      throw new Error('Usuário não autenticado ou perfil não encontrado.');
    }

    // 2. Monta o objeto completo da vaga
    // O ...novaVaga agora já inclui o 'curso'
    const vagaCompleta = {
      ...novaVaga,
      empresaNome: profile.nomeEmpresa,
      empresaUid: user.uid,
      criadaEm: new Date(),
    };

    // 3. Adiciona à coleção 'vagas'
    const vagasCollection = collection(this.firestore, 'vagas');
    return await addDoc(vagasCollection, vagaCompleta);
  }

  // Carrega a vaga para edição
  carregarVagaParaEdicao(id: string) {
    const vagaDocRef = doc(this.firestore, `vagas/${id}`);

    (docData(vagaDocRef, { idField: 'id' }) as Observable<Vaga>)
      .pipe(first())
      .subscribe((vagaEncontrada) => {
        if (vagaEncontrada) {
          this.vagaParaEditar.next(vagaEncontrada);
          this.router.navigateByUrl('/criar-vagas');
        } else {
          console.error('Vaga não encontrada para edição.');
        }
      });
  }

  // Limpa a "memória" de edição
  limparEdicao() {
    this.vagaParaEditar.next(null);
  }

  // Edita uma vaga existente
  async editarVaga(vagaAtualizada: Vaga) {
    const vagaDocRef = doc(this.firestore, `vagas/${vagaAtualizada.id}`);
    const { id, ...data } = vagaAtualizada;
    return await updateDoc(vagaDocRef, data);
  }

  // Exclui uma vaga
  async excluirVaga(idParaExcluir: string) {
    const vagaDocRef = doc(this.firestore, `vagas/${idParaExcluir}`);
    return await deleteDoc(vagaDocRef);
  }
}
