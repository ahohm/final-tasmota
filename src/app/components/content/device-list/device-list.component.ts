import { Component, OnDestroy, OnInit } from '@angular/core';
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
  constructor(private deviceService: DeviceService) {}
  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI();
    this.connect();
    this.deviceService.getAllDevice().pipe().subscribe(
      data =>{
        console.log(data);
        this.datas =data
      },err => {
        console.log(err);
      }) 
  }

  connect() {
    return this.webSocketAPI._connect((val: any) => {
      
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
      
      
      
      
      console.log(val)
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
}
