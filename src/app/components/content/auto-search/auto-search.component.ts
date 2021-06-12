import { Component, OnInit } from '@angular/core';
import { IDevice } from 'local-devices';
import { Address4 } from 'ip-address';
import * as superagent from 'superagent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-search',
  templateUrl: './auto-search.component.html',
  styleUrls: ['./auto-search.component.css'],
})
export class AutoSearchComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };

  ipsToScan: String[] = [];
  ipsRequested: String[] = [];

  errorMessage = '';
  devices: any[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSubmit(f: any): void {
    const { fromIp, toIp, deviceUnername, devicePassword } = f.value;
    console.log(f);
    this.handleFindClicked(fromIp, toIp, deviceUnername, devicePassword);
  }

  handleFindClicked(
    startIp: string = '192.168.1.1',
    endIp: string = '192.168.1.254',
    username: string = 'admin',
    password: string = 'watertec2000'
  ) {

   
    let from = new Address4(startIp).bigInteger();
    let to = new Address4(endIp).bigInteger();

    for (let ipNum: any = from; ipNum <= to; ipNum++) {
      this.ipsToScan.push(Address4.fromBigInteger(ipNum).correctForm());
    }

    this.scanIps(username, password);
  }

  scanIps(username: string, password: string) {
    if (this.ipsToScan.length) {
      while (this.ipsRequested.length < 100 && this.ipsToScan.length) {
        let ip = this.ipsToScan.shift();
        this.ipsRequested.push(ip || '');
        this.enableCorsAndSendRequest(ip!, username, password);
      }
    } else {
      if (this.ipsRequested.length === 0) {
      }
    }
  }

  enableCorsAndSendRequest(ip: String, username: string, password: string) {
    let cmnd = `CORS ${window.location.protocol}//${window.location.hostname}`;

    if (window.location.port && window.location.port !== '') {
      cmnd += `:${window.location.port}`;
    }

    let url =
      'http://' +
      ip +
      '/cm?cmnd=' +
      encodeURIComponent(cmnd).replace(';', '%3B');
    url += `&user=${encodeURIComponent(username)}&password=${encodeURIComponent(
      password
    )}`;

    superagent
      .get(url)
      .timeout({
        response: 5000, // Wait 5 seconds for the server to start sending,
        deadline: 6000, // but allow 6 seconds for the file to finish loading.
      })
      .end(
        function (err: any, res: superagent.Response) {
          setTimeout(
            this.obj.sendRequest.bind(
              this.obj,
              this.ip,
              this.username,
              this.password
            ),
            1000
          );
        }.bind({ obj: this, ip: ip, username: username, password: password })
      );
  }

  sendRequest(ip: String, username: string, password: string) {
    var callback = function (this: any, err: any, response: superagent.Response) {
      this.onCommandResponse({
        key: this.cmnd,
        response: response,
        error: err,
        ip: this.ip,
        username: this.username,
        password: this.password,
        url: this.url,
        success: err ? false : true,
      });
    };

    let cmnd = 'Status 0';
    // let ip = IPAddress.Address4.fromBigInteger(ipNum).correctForm();
    let url = 'http://' + ip + '/cm?cmnd=' + encodeURIComponent(cmnd);

    url += `&user=${encodeURIComponent(username)}&password=${encodeURIComponent(
      password
    )}`;

    superagent
      .get(url)
      .timeout({
        response: 5000, // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
      })
      .end(
        callback.bind({
          onCommandResponse: this.onCommandResponse.bind(this),
          ip: ip,
          username: username,
          password: password,
          url: url,
          cmnd: cmnd,
          success: true,
        })
      );
  }

  onCommandResponse(args: {
    ip: String;
    username: string;
    password: string;
    success: any;
    response: { body: { StatusNET: any; Status: any; WARNING: any } };
  }) {
    console.log(`${args.ip} : Present : ${args.success} Response : %O`, args.response);
    if (args.success && args.response.body.StatusNET) {
   
      this.devices.push(args.response.body)

      console.log(args.response.body.StatusNET.Mac, args.response.body);
    } else {
      if (args.success && args.response.body.WARNING) {
        console.log('Error auth');
      }
    }
    this.ipsRequested = this.ipsRequested.filter((item) => item !== args.ip);
    this.scanIps(args.username, args.password);
  }

  addDevice(device: any){
    // TODO ADD SERVICE
    console.log("ddd")
    console.log("device ::: "+device.StatusNET.IPAddress)
    window.localStorage.setItem('device', JSON.stringify(device))
    this.router.navigate(['/detected-device'])
  }

  fieldTextType: boolean = false;

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
