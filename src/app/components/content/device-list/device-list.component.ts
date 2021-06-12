import { Component, OnDestroy, OnInit } from '@angular/core';
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


  webSocketAPI!: WebSocketAPI;
  greeting: any;
  name!: string;
  constructor() {}
  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI();
    this.connect();
  }

  connect() {
    return this.webSocketAPI._connect((val: any) => {
      
      if(val.ip != null){
        this.devices = val;
      }else{
        this.devices2 = val;
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
