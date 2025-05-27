import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor(
    private firestore: Firestore,
    private auth: AuthService
  ) { }

  // Retorna todos os documentos da collection como objeto indexado pelo id
  getCollection(): Observable<any> {
    const ref = collection(this.firestore, 'siteContent');
    return collectionData(ref, { idField: 'id' }).pipe(
      map(arr => arr.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}))
    );
  }

  // Editar (update) documento existente
  async updateDocument(docId: string, data: any) {
    const user = this.auth.user$.value as User | null;
    if (!user) {
      alert('Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const docRef = doc(this.firestore, 'siteContent', docId);

    try {
      await updateDoc(docRef, data);
      alert('Documento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('Erro ao salvar documento. Verifique o console para mais detalhes.');
    }
  }

  // Criar ou sobrescrever (set) documento
  async setDocument(docId: string, data: any) {
    const user = this.auth.user$.value as User | null;
    if (!user) {
      alert('Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const docRef = doc(this.firestore, 'siteContent', docId);

    try {
      await setDoc(docRef, data);
      alert('Documento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('Erro ao salvar documento. Verifique o console para mais detalhes.');
    }
  }

}