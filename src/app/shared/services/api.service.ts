import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  collectionName='table-folders';

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private afs:AngularFirestore
    ) { }


  readFolder() {
    return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('date', 'asc')
    );
  }
  
  readPersonalFolderByUid(uid:string){
    return this.afs
      .collection(this.collectionName, (ref) => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'id'});
  }

  createFolder(nomClient: string, nomClasseur: string, directory: string, specificite: string, year: string, month: string, folder: string, folderCustom: string, state:string, comment: string, createdAt: Date, uid: string){
    return this.afs
    .collection(`${this.collectionName}`)
      .add({ nomClient, nomClasseur, directory, year, specificite, month, folder, folderCustom, state, comment, createdAt:new Date, uid});
  }

  postFolder(data: any){
    //return this.http.post<any>("http://localhost:3001/folderList/", data);
  }

  getFolders(){
    //return this.http.get<any>("http://localhost:3001/folderList/");
    return this.afs.collection(`${this.collectionName}`).valueChanges({ idField:'id'});

  }
  /*getFolderById(id: number){
    //return this.http.get<any>("http://localhost:3001/folderList/"+id);
    return this.afs
      .collection(this.collectionName)
      .valueChanges({ idField: 'id'});
  }*/

  getFolderById(id: any) {
    return this.afs.doc(`${this.collectionName}/${id}`).valueChanges();
  }

  putFolder(data:any, id:number){
    //return this.http.put<any>("http://localhost:3001/folderList/"+id, data);
    return this.afs.doc<any>(`${this.collectionName}/${id}`)
    .update(data);
  }
  
  deleteFolder(id:number){
    //return this.http.delete<any>("http://localhost:3001/folderList/"+id);
    return this.afs
    .doc<any>(`${this.collectionName}/${id}`)
    .delete();
  }
}