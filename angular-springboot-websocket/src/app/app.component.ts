import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { WebSocketAPI } from './services/WebSocketAPI';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  title = 'angular8-springboot-websocket';

  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  messages: Array<any> = [];
  newMessage: string;
  connected = false;

  @ViewChild('chatLog') private myScrollContainer: ElementRef;

  ngOnInit(): void {
    this.webSocketAPI = new WebSocketAPI(this);
    this.connect();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  connect(): void{
    this.webSocketAPI._connect();
  }

  disconnect(): void{
    this.webSocketAPI._disconnect();
  }

  sendMessage(): void{
    if (this.newMessage === '') {
      return;
    }
    this.webSocketAPI._send({from: this.name, text: this.newMessage});
    this.newMessage = '';
  }

  handleMessage(message): void{
    this.messages = [...this.messages , message];
  }

  login(): void {
    this.greeting = 'Hello, ' + this.name;
  }

  fileChangeEvent(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const msg = {
          from: this.name,
          text: data,
          fileName: file.name
        };
        this.webSocketAPI._send(msg);
      };
      reader.readAsDataURL(file);
    }
  }

  download(message): void {
    console.log('download file...');
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = message.text;
    downloadLink.target = '_self';
    downloadLink.download = message.fileName;
    downloadLink.click();
  }
}
