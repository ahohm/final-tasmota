import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from 'src/app/_services/device.service';
import {Location} from '@angular/common'

@Component({
  selector: 'app-detected-device',
  templateUrl: './detected-device.component.html',
  styleUrls: ['./detected-device.component.css'],
})
export class DetectedDeviceComponent implements OnInit {
  
  device : any ;

  deviceToSave: any ={
    MqttHost: '',
    MqttPort: '',
    MqttUser: '',
    MqttClient: '',
    Mac: '',
    Hostname: '',
    IPAddress: '',
    SSId: '',
    Topic: '',
    DeviceName: '',
    Position: '',
    Name1: '',
    Name2: '',
    IncludeAllOff: false,
    ProtectedFromPoweringOn: false,
    ProtectedFromPoweringOff: false



  }

  constructor(private toastr: ToastrService, private deviceService: DeviceService, private router : Router, private location : Location) {}

  ngOnInit(): void {
    if(window.localStorage.getItem('device')!= undefined){

    this.toastr.success('Appareil trouvé', '');
    let x:any = window.localStorage.getItem('device')
    this.device = JSON.parse(x)
    this.deviceToSave.MqttHost = this.device.StatusMQT.MqttHost 
    this.deviceToSave.MqttPort = this.device.StatusMQT.MqttPort
    this.deviceToSave.MqttUser = this.device.StatusMQT.MqttUser
    this.deviceToSave.MqttClient = this.device.StatusMQT.MqttClient
    this.deviceToSave.Mac = this.device.StatusNET.Mac
    this.deviceToSave.Hostname = this.device.StatusNET.Hostname,
    this.deviceToSave.IPAddress=  this.device.StatusNET.IPAddress,
    this.deviceToSave.SSId =  this.device.StatusSTS.Wifi.SSId,
    this.deviceToSave.Topic=  this.device.Status.Topic,
    this.deviceToSave.DeviceName= this.device.Status.DeviceName
   
    window.localStorage.removeItem('device')
    console.log(this.deviceToSave)
    }else{
      this.location.back()
    }
  }

  onSubmit(f:any){
    const { position, name1, name2, IncludeAllOff, ProtectedFromPoweringOn, ProtectedFromPoweringOff } = f.value;

    this.deviceToSave.Position = position;
    this.deviceToSave.Name1 = name1
    this.deviceToSave.Name2 = name2;
    this.deviceToSave.IncludeAllOff = IncludeAllOff;
    this.deviceToSave.ProtectedFromPoweringOn = ProtectedFromPoweringOn;
    this.deviceToSave.ProtectedFromPoweringOff = ProtectedFromPoweringOff;

    console.log(this.deviceToSave)

    this.deviceService.saveDevice(this.deviceToSave).pipe().subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err)
        this.toastr.error('Failed', err.message);
      }
    )
  }

  back(){
    this.location.back()
  }
}
