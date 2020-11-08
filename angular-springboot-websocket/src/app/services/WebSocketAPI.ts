import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from '../app.component';

export class WebSocketAPI {
  webSocketEndPoint = 'http://localhost:8080/ws';
  topic = '/topic/messages';
  stompClient: any;
  appComponent: AppComponent;

  constructor(appComponent: AppComponent){
    this.appComponent = appComponent;
  }

  _connect(): void {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const tmpThis = this;
    tmpThis.stompClient.connect({}, () => {
      tmpThis.stompClient.subscribe(tmpThis.topic, (sdkEvent) => {
        tmpThis.onMessageReceived(sdkEvent);
      });
      this.appComponent.connected = true;
    }, this.errorCallBack);
  }

  _disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    this.appComponent.connected = false;
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message): void {
    console.log('calling logout api via web socket');
    this.stompClient.send('/app/chat', {}, JSON.stringify(message));
  }

  onMessageReceived(message): void {
    console.log('Message Recieved from Server :: ' + message);
    this.appComponent.handleMessage(JSON.parse(message.body));
  }
}
