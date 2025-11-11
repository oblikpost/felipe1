import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface CompanyProfile {
  uid: string;
  email: string;
  nomeEmpresa: string;
  cnpj: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  companyProfile$: Observable<CompanyProfile | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    // Inicialização DENTRO do constructor (Corrige o NG0203)
    this.isLoggedIn$ = this.afAuth.authState.pipe(map((user) => !!user));

    this.companyProfile$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .doc<CompanyProfile>(`empresas/${user.uid}`)
            .valueChanges()
            .pipe(map((profile) => profile || null));
        } else {
          return of(null);
        }
      })
    );
  }

  // Função de Registro
  async registerCompany(
    email: string,
    pass: string,
    nomeEmpresa: string,
    cnpj: string
  ) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        pass
      );

      if (!userCredential || !userCredential.user) {
        throw new Error('Não foi possível obter o usuário após o registro.');
      }

      const user = userCredential.user;
      // Esta é a linha (aprox. 63) que falha se o AppModule estiver errado
      const companyDocRef = this.afs.doc(`empresas/${user.uid}`);

      const profile: CompanyProfile = {
        uid: user.uid,
        email: user.email!,
        nomeEmpresa: nomeEmpresa,
        cnpj: cnpj,
      };

      await companyDocRef.set(profile);

      return userCredential;
    } catch (e) {
      console.error('Erro no AuthService (registerCompany):', e);
      throw e;
    }
  }

  // Função de Login
  async login(email: string, pass: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, pass);
    } catch (e) {
      console.error('Erro no AuthService (login):', e);
      throw e;
    }
  }

  // Função de Logout
  logout() {
    return from(this.afAuth.signOut());
  }

  // Função para Adicionar Vaga
  async addVaga(vagaData: { titulo: string; descricao: string; tipo: string }) {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }

    const companyDoc = this.afs.doc(`empresas/${user.uid}`);
    const companySnapshot = await companyDoc.get().toPromise();
    const companyData = companySnapshot?.data() as CompanyProfile | undefined;

    if (!companyData) {
      throw new Error('Dados da empresa não encontrados.');
    }

    const vagaCompleta = {
      ...vagaData,
      empresaNome: companyData.nomeEmpresa,
      empresaUid: user.uid,
      criadaEm: new Date(),
    };

    const vagasCollection = this.afs.collection('vagas');
    return await vagasCollection.add(vagaCompleta);
  }
}
