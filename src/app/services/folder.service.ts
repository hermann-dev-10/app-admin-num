import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private personalFolderCollection!: AngularFirestoreCollection<any>;
  personalFolders!: Observable<any[]>;
  folders$!: Observable<any[]>;

  collectionName = 'table-folders';

  foldersSubject: BehaviorSubject<any[]> = new BehaviorSubject(<any[]>[]);


  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase, 
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private apiService: ApiService,
     ) { }

     ngOnInit(){
      console.log('Hallo');
      this.folders$ = this.apiService.getFolders();
     }

    readPersonalFolders(): Observable<any[]> {
      return this.personalFolders;
    }

    getFolders(){
      return this.afs.collection(`${this.collectionName}`).valueChanges({ idField: 'id'});
     }  

     dispatchFolders(){
      //this.foldersSubject.next(this.folders$);
    }

}
