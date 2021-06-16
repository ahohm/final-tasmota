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
        this.datas = data
        console.log(this.datas)
        
        for (let index = 0; index < this.datas.length; index++) {
          this.datas[index].callback =  this.connect(index, this.datas[index]);
        }
      },err => {
        console.log(err);
      }) 
  }

  connect(index: any, element: any):any {
    return this.webSocketAPI._connect(element.Topic, (val: any) => {
      console.log(val)
      let dd = this.datas[index];

   if(val.ip != null){
      console.log("ip")
    dd.devices = val;
   }else{
    console.log("POWER ON")
    
    if(typeof(val.POWER1) === "string"  && val.POWER1 === "OFF"){
      console.log("POWER OFF")
       dd.power=false
        }else if(typeof(val.POWER1) === "string"  && val.POWER1 === "ON"){
          console.log("POWER ON")
                    dd.power=true
        }else{
          console.log("DEVICES")
          dd.devices2 = val;
        }
   }
   this.datas[index] = dd;
   console.log("data :" + JSON.stringify(dd))

    console.log("list of data :" + JSON.stringify(this.datas ))
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
