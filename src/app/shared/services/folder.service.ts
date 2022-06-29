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

  private folders: any[] = []

  foldersSubject: BehaviorSubject<any[]> = new BehaviorSubject(<any[]>[]);


  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase, 
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private apiService: ApiService,
     ) { }

     //Utiliser ce folderService plutot que apiService
     ngOnInit(){
      this.folders$ = this.apiService.getFolders();
     }

    readPersonalFolders(): Observable<any[]> {
      return this.personalFolders;
    }

    getFolders(){
      return this.afs.collection(`${this.collectionName}`).valueChanges({ idField: 'id'});
     }  

     dispatchFolders(){
      this.foldersSubject.next(this.folders);
    }

    readPersonalFolderByUID(uid: string) {
      return this.afs
        .collection(this.collectionName, (ref) => ref.where('uid', '==', uid))
        .valueChanges({ idField: 'id' });
    }

    /*
    async editFolder(folder: Folder, folderId: string): Promise<any> {
    try {
      if (newOfferPhoto && offer.photo && offer.photo !== ''){
        await this.removePhoto(offer.photo)
      }
      if (newOfferPhoto){
        const newPhotoUrl = await this.uploadPhoto(newOfferPhoto);
        offer.photo = newPhotoUrl;
      }
      await this.db.list('offers').update(offerId, offer);
      const offerIndexToUpdate = this.offers.findIndex(el => el.id === offerId);
      this.offers[offerIndexToUpdate] = { ...offer, id: offerId};
      this.dispatchOffers();
      return {...offer, id: offerId};
    } catch (error) {
      throw error;
    }
  }

  async deleteOffer(offerId: string): Promise<Offer>{

    try {
      const offerToDeleteIndex = this.offers.findIndex(el => el.id === offerId);
      const offerToDelete = this.offers[offerToDeleteIndex];

      if(offerToDelete.photo && offerToDelete.photo !== ''){
        await this.removePhoto(offerToDelete.photo); //remove
    }
    await this.db.list('offers').remove(offerId);
    this.offers.splice(offerToDeleteIndex, 1);
    this.dispatchOffers();
    return offerToDelete;
    } catch (error) {
      throw error;
    }
  }
    */

}
