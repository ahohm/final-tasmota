import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://4ded17a0ad68.ngrok.io';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  changeState(topic:any, value: any): Observable<any> {
    return this.http.post(AUTH_API+'/publish/'+topic , {
      value
    }, httpOptions);
  }

  saveDevice(value: any): Observable<any> {
    return this.http.post(AUTH_API+'/devices/add' , 
      value
    , httpOptions);
  }
  getAllDevice(): Observable<any> {
    return this.http.get(AUTH_API+'/devices', httpOptions);
  }
}
