import { Injectable } from '@angular/core';
import { Firestore, doc, docData, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getHeroSection(): Observable<any> {
    const ref = doc(this.firestore, 'siteContent/heroSection');
    return docData(ref);
  }

  getPlanos(): Observable<any> {
    const ref = doc(this.firestore, 'siteContent/planos');
    return docData(ref);
  }

  // Retorna todos os documentos de uma collection como objeto indexado pelo id
  getCollection(): Observable<any> {
    const ref = collection(this.firestore, 'siteContent');
    return collectionData(ref, { idField: 'id' }).pipe(
      map(arr => arr.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}))
    );
  }

  // Adicione mais métodos para outras seções
}