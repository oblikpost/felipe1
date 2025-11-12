import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Importar as novas funções modulares do Firebase
import {
  Auth,
  authState,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  getDoc,
  collection,
  addDoc,
  DocumentReference,
} from '@angular/fire/firestore';

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
  // 3. Usar inject() no topo da classe
  public auth: Auth = inject(Auth); // <-- CORREÇÃO: Alterado de private para public
  private firestore: Firestore = inject(Firestore);

  public companyProfile$: Observable<CompanyProfile | null>;
  public isLoggedIn$: Observable<boolean>;

  // 4. O construtor agora pode ficar (quase) vazio
  constructor() {
    // 5. Inicializar as propriedades usando as novas funções
    this.isLoggedIn$ = authState(this.auth).pipe(map((user) => !!user));

    this.companyProfile$ = authState(this.auth).pipe(
      switchMap((user) => {
        if (user) {
          // 6. Usar a nova sintaxe do Firestore
          const userDocRef = doc(this.firestore, `empresas/${user.uid}`);
          // docData já trata o 'valueChanges' e o mapeamento
          return docData(userDocRef) as Observable<CompanyProfile | null>;
        } else {
          return of(null);
        }
      })
    );
  }

  // Função de Registro (Refatorada)
  async registerCompany(
    email: string,
    pass: string,
    nomeEmpresa: string,
    cnpj: string
  ) {
    try {
      // 7. Usar a função modular
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass
      );

      if (!userCredential || !userCredential.user) {
        throw new Error('Não foi possível obter o usuário após o registro.');
      }

      const user = userCredential.user;

      // 8. Usar 'doc()' e 'setDoc()'
      const companyDocRef = doc(this.firestore, `empresas/${user.uid}`);

      const profile: CompanyProfile = {
        uid: user.uid,
        email: user.email!,
        nomeEmpresa: nomeEmpresa,
        cnpj: cnpj,
      };

      await setDoc(companyDocRef, profile); // Usar setDoc

      return userCredential;
    } catch (e) {
      console.error('Erro no AuthService (registerCompany):', e);
      throw e;
    }
  }

  // Função de Login (Refatorada)
  async login(email: string, pass: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, pass);
    } catch (e) {
      console.error('Erro no AuthService (login):', e);
      throw e;
    }
  }

  // Função de Logout (Refatorada)
  logout() {
    return from(signOut(this.auth));
  }

  // A função addVaga foi removida daqui e movida para o VagasService.
}
