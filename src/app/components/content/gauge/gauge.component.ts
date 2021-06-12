import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DeviceService } from 'src/app/_services/device.service';
import { jqxKnobComponent } from 'jqwidgets-ng/jqxknob';
import { jqxNumberInputComponent } from 'jqwidgets-ng/jqxnumberinput';

import { jqxGaugeComponent } from 'jqwidgets-ng/jqxgauge';
import { jqxLinearGaugeComponent } from 'jqwidgets-ng/jqxlineargauge';

import { WebSocketAPI } from 'src/app/_socket/WebSocketAPI ';
import { DeviceListComponent } from '../device-list/device-list.component';
@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GaugeComponent implements OnInit, AfterViewInit, OnDestroy {
  webSocketAPI!: WebSocketAPI;
  data: any = {
    DHT11: {
      Temperature: '0',
    },
    POWER1: '',
  };

  device: any = {
    power: false,
    dn: '----',
    hn: '----',
    ip: '----',
  };

  greeting: any;
  name1!: string;

  public name = 'Gauge chart';

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

  // --------------------------------------------------

  // --------------------------------------------------

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

  //------------------------------------------------------

  @ViewChild('myGauge', { static: false })
  myGauge!: jqxGaugeComponent;
  @ViewChild('gaugeValue', { static: false })
  gaugeValue!: ElementRef;
  ngAfterViewInit(): void {
    this.myGauge.value(10);
  }
  ticksMinor: any = { interval: 5, size: '5%' };
  ticksMajor: any = { interval: 10, size: '9%' };
  ranges: any[] = [
    {
      startValue: 0,
      endValue: 55,
      style: { fill: '#4bb648', stroke: '#4bb648' },
      endWidth: 5,
      startWidth: 1,
    },
    {
      startValue: 55,
      endValue: 110,
      style: { fill: '#fbd109', stroke: '#fbd109' },
      endWidth: 10,
      startWidth: 5,
    },
    {
      startValue: 110,
      endValue: 165,
      style: { fill: '#ff8000', stroke: '#ff8000' },
      endWidth: 13,
      startWidth: 10,
    },
    {
      startValue: 165,
      endValue: 220,
      style: { fill: '#e02629', stroke: '#e02629' },
      endWidth: 16,
      startWidth: 13,
    },
  ];
  ticksMinorLinear: any = {
    size: '5%',
    interval: 2.5,
    style: { 'stroke-width': 1, stroke: '#aaaaaa' },
  };
  ticksMajorLinear: any = { size: '10%', interval: 10 };
  labels: any = {
    interval: 20,
    formatValue: (value: number, position: string): string => {
      if (position === 'far') {
        value = (9 / 5) * value + 32;
        if (value === -76) {
          return '°F';
        }
        return value + '°';
      }
      if (value === -60) {
        return '°C';
      }
      return value + '°';
    },
  };
  rangesLinear: any[] = [
    {
      startValue: -10,
      endValue: 10,
      style: { fill: '#FFF157', stroke: '#FFF157' },
    },
    {
      startValue: 10,
      endValue: 35,
      style: { fill: '#FFA200', stroke: '#FFA200' },
    },
    {
      startValue: 35,
      endValue: 60,
      style: { fill: '#FF4800', stroke: '#FF4800' },
    },
  ];
  onValueChanging(event: any): void {
    this.gaugeValue.nativeElement.innerHTML =
      Math.round(event.args.value) + ' C°';
  }

  constructor(private deviceSrvice: DeviceService) {}
  ngOnDestroy(): void {
    this.disconnect();
  }
  onChagePowerState(v: boolean) {
    console.log(v);
    this.data.power = v;
    if (!v) {
      this.data.DHT11.Temperature = 0;
    }
    console.log(this.data.power);
    this.deviceSrvice
      .changeState('TOGGLE')
      .pipe()
      .subscribe((data) => console.log(data));
  }

  ngOnInit(): void {
    this.webSocketAPI = new WebSocketAPI();
    this.connect();
  }

  connect() {
  
      return this.webSocketAPI._connect((val: any) => {
        if(typeof(val.POWER1) === "string"  && val.POWER1 === "ON"){
          this.data.power = true;
        }else if(typeof(val.POWER1) === "string"  && val.POWER1 === "OFF"){
          this.data.power = false;
          this.data.DHT11.Temperature = 0;
        }else{
          if(typeof(val.dn) === "string"){
            this.device.dn = val.dn;
            this.device.ip = val.ip;
          }else{
            //this.needleValue = val.DHT11.Temperature;
            //this.options.arcDelimiters = [val.DHT11.Temperature];
            //this.bottomLabel = ''+val.DHT11.Temperature;
            let temp = val.DHT11.Temperature;
            this.data.DHT11.Temperature = val.DHT11.Temperature;
            this.myGauge.value(temp);
          }
        }
  
        console.log();
      });

  }

  //-------------------------

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