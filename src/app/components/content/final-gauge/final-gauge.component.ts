import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DeviceService } from 'src/app/_services/device.service';
import { jqxKnobComponent } from 'jqwidgets-ng/jqxknob';
import { jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';

import { WebSocketAPI } from 'src/app/_socket/WebSocketAPI ';

@Component({
  selector: 'app-final-gauge',
  templateUrl: './final-gauge.component.html',
  styleUrls: ['./final-gauge.component.css'],
})
export class FinalGaugeComponent implements OnInit, OnDestroy {
  obj: any ={};

  active: Boolean = false;
  dn : string = "--";
  ip : string = "--";
  
  data: any = {
    DHT11: {
      Temperature: '0',
    }
  };

  temp: number = 10;
  
  max:number = 100 ;

  device: any = {
    power: false,
    dn: '----',
    hn: '----',
    ip: '----',
  };
  d: any = {};
  public canvasWidth = 300;
  public needleValue: number = 0;
  public centralLabel = '';
  public name = 'Temperature ';
  public bottomLabel = '---';
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(255,69,0)', 'lightgray'],
    arcDelimiters: [0.1],
    rangeLabel: ['0', '100'],
    needleStartValue: 0,
  };

  subscriber: any;
  webSocketAPI!: WebSocketAPI;

  gaugeType = 'semi';
  c = 4;
  lgaugeLabel = 'Heat';
  lgaugeAppendText = 'C°';
  thresholdConfig = {
    '0': { color: 'green' },
    '40': { color: 'orange' },
    '75.5': { color: 'red' },
    '100': { color: 'black' },
  };

  constructor(private deviceSrvice: DeviceService) {}

  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit() {
    if(window.localStorage.getItem('device')!= undefined){
      let x:any = window.localStorage.getItem('device')
      this.d = JSON.parse(x)

      this.dn = this.d.DeviceName;
      this.ip = this.d.IPAddress;

      this.webSocketAPI = new WebSocketAPI();
      window.localStorage.removeItem('device');

      this.webSocketAPI.connecting(() => {
       this.subscriber = this.connect(this.d.Topic);
      });
      }else{
      }

  
  }

  connect(topic: any ) {
    return this.webSocketAPI._connect(topic, (val: any) => {
      if(typeof(val.POWER1) === "string"  && val.POWER1 === "ON"){
        this.active = true;
      }else if(typeof(val.POWER1) === "string"  && val.POWER1 === "OFF"){
        this.active = false;
      } if(typeof(val.POWER) === "string"  && val.POWER === "ON"){
        this.active = true;
      }else if(typeof(val.POWER) === "string"  && val.POWER === "OFF"){
        this.active = false;
      } else{
        if(typeof(val.dn) === "string"){
          this.dn = val.dn;
          this.ip = val.ip;
        }else{

          if(val.DHT11 !== undefined){
            this.needleValue = val.DHT11.Temperature;
            this.options.arcDelimiters = [val.DHT11.Temperature];
            this.bottomLabel = ''+val.DHT11.Temperature;
          } else if (val.DS18B20 !== undefined){
            this.needleValue = val.DS18B20.Temperature;
            this.options.arcDelimiters = [val.DS18B20.Temperature];
            this.bottomLabel = ''+val.DS18B20.Temperature;
          }
          
        }
      }

      console.log();
    });
  }

  disconnect() {
    this.subscriber.unsubscribe();
    this.subscriber = null
  }



  /** volume ----- */
  @ViewChild('myKnob', { static: false })
  myKnob!: jqxKnobComponent;
  @ViewChild('myNumberInput', { static: false })
  myNumberInput!: jqxNumberInputComponent;
  style: any = {
    stroke: '#dfe3e9',
    strokeWidth: 3,
    fill: {
      color: '#fefefe',
      gradientType: 'linear',
      gradientStops: [
        [0, 1],
        [50, 0.9],
        [100, 1],
      ],
    },
  };
  marks: any = {
    colorRemaining: { color: 'grey', border: 'grey' },
    colorProgress: { color: '#00a4e1', border: '#00a4e1' },
    type: 'line',
    offset: '71%',
    thickness: 3,
    size: '6%',
    majorSize: '9%',
    majorInterval: 10,
    minorInterval: 2,
  };
  labels1: any = {
    offset: '88%',
    step: 10,
    visible: true,
  };
  progressBar: any = {
    style: { fill: '#00a4e1', stroke: 'grey' },
    size: '9%',
    offset: '60%',
    background: { fill: 'grey', stroke: 'grey' },
  };
  pointer: any = {
    type: 'arrow',
    style: { fill: '#00a4e1', stroke: 'grey' },
    size: '59%',
    offset: '49%',
    thickness: 20,
  };
  onChange(event: any): void {
    if (
      event.args.changeSource == 'propertyChange' ||
      event.args.changeSource == 'val'
    ) {
      return;
    }
    this.myNumberInput.val(event.args.value);
    console.log(event.args.value);
    this.max = event.args.value;
      this.limit(this.max, this.needleValue)  
  }


  onMouseDown(event: any): void {
    event.stopPropagation();
  }
  onKeyup(): void {
    let val = this.myNumberInput.val();
    this.myKnob.val(val);
  }
  onValueChanged(): void {
    let val = this.myNumberInput.val();
    this.myKnob.val(val);
  }
  onChagePowerState(v: boolean) {
    console.log(v);
    this.active = v;
    if (!v) {
      this.data.DHT11.Temperature = 0;
    }
    console.log(this.data.power);
    this.deviceSrvice
      .changeState(this.d.Topic, 'TOGGLE')
      .pipe()
      .subscribe((data) => console.log(data));
  }

  oldState = true;
  newState = false;

  oldState2 = true;
  newState2 = false;

  limit(max:number, temp: number){

    if(temp>max && this.newState !== this.oldState){
      console.log("tooogle")
      this.active = true;

      this.deviceSrvice
      .changeState(this.d.Topic,'OFF')
      .pipe()
      .subscribe((data) => {
       
      });
    }

    if(temp<max && this.newState2 !== this.oldState2){
      console.log("tooogle")
      this.active = false;
        this.deviceSrvice
      .changeState(this.d.Topic,'ON')
      .pipe()
      .subscribe((data) => {
        
      });
    }

    if(temp > max) {
      if(this.oldState !== this.newState){
        this.newState = this.oldState
      }
      this.newState2 = !this.oldState2
    
    } else {

      if(this.oldState2 !== this.newState2){
        this.newState2 = this.oldState2
      }

      this.newState = !this.oldState
    } 
  }
}
