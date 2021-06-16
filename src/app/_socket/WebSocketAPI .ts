 
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { DeviceListComponent } from '../components/content/device-list/device-list.component';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://158.69.113.195:8080/websocket-example';
    topic: string = "/topic/";
    stompClient: any;
    
    //appComponent: DeviceListComponent;
    constructor(){
        
    }
    _connect(topic: any, callback: any):any {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        // TODO 
        this.stompClient = Stomp.over(ws);
        const _this = this;
       return _this.stompClient.connect({}, function (frame: any) {
            _this.stompClient.subscribe(_this.topic + topic, function (sdkEvent: any) {
                
                callback(_this.onMessageReceived(sdkEvent))
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, (err : any) => this.errorCallBack(topic, err));
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(topic:any, error: any) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect(topic, (val: any) => {
                
              });
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message: any) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/user", {}, JSON.stringify(message));
    }

    onMessageReceived(message: any) {
        console.log( JSON.parse(message.body));
        return JSON.parse(message.body);
        //this.appComponent.handleMessage(JSON.stringify(message.body.content));
    }




}