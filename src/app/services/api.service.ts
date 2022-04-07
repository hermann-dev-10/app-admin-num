import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postFolder(data: any){
    return this.http.post<any>("http://localhost:3001/folderList/", data);
  }

  getFolder(){
    return this.http.get<any>("http://localhost:3001/folderList/");
  }
   getFolderById(id: number){
    return this.http.get<any>("http://localhost:3001/folderList/"+id);
  }

  putFolder(data:any, id:number){
    return this.http.put<any>("http://localhost:3001/folderList/"+id, data);
  }
  deleteFolder(id:number){
    return this.http.delete<any>("http://localhost:3001/folderList/"+id);
  }
}
