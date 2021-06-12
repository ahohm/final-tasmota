import { Component, OnInit } from '@angular/core';
import { Address4 } from 'ip-address';
import * as superagent from 'superagent';
import { BigInteger } from 'jsbn';
import { DeviceService } from 'src/app/_services/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
})
export class AddDeviceComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };

  ipsToScan: String[] = [];
  ipsRequested: String[] = [];

  errorMessage = '';
  devices: any[] = [];
 
  constructor(private deviceService:  DeviceService, private router : Router) {}

  ngOnInit(): void {}


  onSubmit(f: any): void {
    const { fromIp, deviceUnername, devicePassword } = f.value;
    console.log(f);
    this.handleFindClicked(fromIp, deviceUnername, devicePassword);
    console.log("logg")
  }

  handleFindClicked(startIp: string = "192.168.1.1",
    username: string = "admin",
    password: string = "watertec2000") {

    let from = new Address4(startIp).bigInteger();

    this.scanIps(from, username, password);
  }

  scanIps(startIp: BigInteger, username: string, password: string) {
    this.enableCorsAndSendRequest(Address4.fromBigInteger(startIp).correctForm(), username, password)
  }

  enableCorsAndSendRequest(ip: String, username: string, password: string) {
    let cmnd = `CORS ${window.location.protocol}//${window.location.hostname}`

    if (window.location.port && window.location.port !== "") {
      cmnd += `:${window.location.port}`
    }

    let url = 'http://' + ip + '/cm?cmnd=' + encodeURIComponent(cmnd).replace(";", "%3B");
    url += `&user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`

    superagent.get(url)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 6000, // but allow 6 seconds for the file to finish loading.
      }).end(function (err: any, res: superagent.Response) {
        setTimeout(this.obj.sendRequest.bind(this.obj, this.ip, this.username, this.password), 1000);
      }.bind({ obj: this, ip: ip, username: username, password: password }));
  }

  sendRequest(ip: String, username: string, password: string) {

    var callback = function (this: any, err: any, response: superagent.Response) {
      this.onCommandResponse({ key: this.cmnd, response: response, error: err, ip: this.ip, username: this.username, password: this.password, url: this.url, success: err ? false : true });
    }

    let cmnd = "Status 0"
    // let ip = IPAddress.Address4.fromBigInteger(ipNum).correctForm();
    let url = 'http://' + ip + '/cm?cmnd=' + encodeURIComponent(cmnd);


    url += `&user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`

    superagent.get(url)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
      })
      .end(callback.bind({ onCommandResponse: this.onCommandResponse.bind(this), ip: ip, username: username, password: password, url: url, cmnd: cmnd, success: true }))

  }


  /**
   *
  app.component.ts:81 DC:4F:22:AD:02:79
  {Status: {…}, StatusPRM: {…}, StatusFWR: {…}, StatusLOG: {…}, StatusMEM: {…}, …}
  Status: {Module: 39, DeviceName: "Tasmota", FriendlyName: Array(2), Topic: "4chPro2", ButtonTopic: "0", …}
  StatusFWR: {Version: "9.3.1(tasmota)", BuildDateTime: "2021-03-09T16:12:28", Boot: 31, Core: "2_7_4_9", SDK: "2.2.2-dev(38a443e)", …}
  StatusLOG: {SerialLog: 2, WebLog: 2, MqttLog: 3, SysLog: 0, LogHost: "", …}
  StatusMEM: {ProgramSize: 593, Free: 408, Heap: 23, ProgramFlashSize: 1024, FlashSize: 1024, …}
  StatusMQT: {MqttHost: "138.197.130.191", MqttPort: 1883, MqttClientMask: "4chPro2", MqttClient: "4chPro2", MqttUser: "4chPro2", …}
  StatusNET: {Hostname: "4chPro2-0633", IPAddress: "192.168.1.250", Gateway: "192.168.1.1", Subnetmask: "255.255.255.0", DNSServer: "192.168.1.1", …}
  StatusPRM: {Baudrate: 115200, SerialConfig: "8N1", GroupTopic: "tasmotas", OtaUrl: "http://ota.tasmota.com/tasmota/release/tasmota.bin.gz", RestartReason: "Power On", …}
  StatusSNS: {Time: "2021-06-01T03:37:22", DHT11: {…}, TempUnit: "C"}
  StatusSTS: {Time: "2021-06-01T03:37:22", Uptime: "0T06:41:46", UptimeSec: 24106, Heap: 23, SleepMode: "Dynamic", …}
  StatusTIM: {UTC: "2021-06-01T02:37:22", Local: "2021-06-01T03:37:22", StartDST: "2021-03-28T02:00:00", EndDST: "2021-10-31T03:00:00", Timezone: "+01:00", …}
  __proto__: Object
   */

//TODO

addDevice(device: any){
  // TODO ADD SERVICE
  console.log("ddd")
  console.log("device ::: "+device.StatusNET.IPAddress)
  window.localStorage.setItem('device', JSON.stringify(device))
  this.router.navigate(['/detected-device'])
}
  onCommandResponse(args: { ip: string; username: string; password: string; success: any; response: { body: { StatusNET: any; WARNING: any; }; }; }) {
    console.log(`${args.ip} : Present : ${args.success} Response : %O`, args.response);
    if (args.success && args.response.body.StatusNET) {
      // TODO ADD SERVICE
      this.addDevice(args.response.body)
      console.log(args.response.body.StatusNET.Mac, args.response.body)

    } else {
      if (args.success && args.response.body.WARNING) {
        console.log("Error auth")

      }
    }
    let from = new Address4(args.ip).bigInteger();
  //  this.scanIps(from, args.username, args.password)
  }

  fieldTextType: boolean = false;

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
