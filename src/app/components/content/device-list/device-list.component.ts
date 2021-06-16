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
    this.deviceService.getAllDevice().pipe().subscribe(
      data =>{
        this.datas =data
        data.forEach((_element:any) => {
          this.connect(_element.Topic);
        });
      
      },err => {
        console.log(err);
      }) 
  }

  connect(topic: any) {
    return this.webSocketAPI._connect(topic, (val: any) => {

   if(val.ip != null){
        this.devices = val;
   }else{
        if(typeof(val.POWER1) === "string"  && val.POWER1 === "OFF"){
            this.power=false
        }else if(typeof(val.POWER1) === "string"  && val.POWER1 === "OONN"){
          this.power=true
        }else{
          this.devices2 = val;
        }

   }
    
    });
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message: any) {
    this.greeting = message;
  }

  goToGauge(data: any){
    window.localStorage.setItem('device', JSON.stringify(data))
    this.router.navigate(['/gauge'])
    }
}
