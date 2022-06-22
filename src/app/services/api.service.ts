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

  createFolder(nomClasseur:string, directory:string, date:Date, comment:string, createdAt: Date){
    return this.afs
    .collection(`${this.collectionName}`)
    .add({nomClasseur, directory, date, comment, createdAt:new Date});
  }

  postFolder(data: any){
    //return this.http.post<any>("http://localhost:3001/folderList/", data);
  }

  getFolders(){
    //return this.http.get<any>("http://localhost:3001/folderList/");
    return this.afs.collection(`${this.collectionName}`).valueChanges({ idField:'id'});

  }
  getFolderById(id: number){
    //return this.http.get<any>("http://localhost:3001/folderList/"+id);
  }

  putFolder(data:any, id:number){
    //return this.http.put<any>("http://localhost:3001/folderList/"+id, data);
  }
  deleteFolder(id:number){
    //return this.http.delete<any>("http://localhost:3001/folderList/"+id);
  }
}
