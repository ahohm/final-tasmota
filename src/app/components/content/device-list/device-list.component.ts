import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/_services/device.service';
import { WebSocketAPI } from 'src/app/_socket/WebSocketAPI ';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
})
export class DeviceListComponent implements OnInit, OnDestroy {
  devices: any = {
    ip: '',
    mac: '',
    sw: '',
    hn: '',
    state: '',
  };

  devices2: any = {
    
    Wifi: {
      Signal: ''
    },    
    MqttCount: '',
    UptimeSec: '',
    Sleep: '',
  };

  datas: any =[];

  power:any;

  webSocketAPI!: WebSocketAPI;
  greeting: any;
  name!: string;
  constructor(private deviceService: DeviceService, private router: Router) {}
  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI();
    this.webSocketAPI.connecting(() => {
      this.deviceService.getAllDevice().pipe().subscribe(
        data =>{
          this.datas = data      
          for (let index = 0; index < this.datas.length; index++) {
            this.datas[index].callback =  this.connect(index, this.datas[index]);
          }
        },err => {
          console.log(err);
        }) 
    });

   
  }

  connect(index: any, element: any):any {
    return this.webSocketAPI._connect(element.Topic, (val: any) => {
      let dd = this.datas[index];
   if(val.ip != null){
    dd.devices = val;
   }else{
    console.log(val);
    dd.devices2 = val;
    if(typeof(val.POWER1) === "string"  && val.POWER1 === "OFF"){
       dd.power=false
        }else if(typeof(val.POWER1) === "string"  && val.POWER1 === "ON"){
                    dd.power=true
        }else{
          dd.devices2 = val;
        }
   }
   this.datas[index] = dd;
   this.datas = this.datas;
    });
  }

  disconnect() {
    this.datas.forEach((ee: any) => {
      ee.callback.unsubscribe();
    });
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message: any) {
    this.greeting = message;
  }

  goToGauge(data: any){
    window.localStorage.setItem('device', JSON.stringify(data))
    this.router.navigate(['/chart'])
    }
}
