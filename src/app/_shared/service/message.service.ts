import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private message = new Subject<string>();
  constructor() { }

  getMessage(): Observable<string> {
    return this.message.asObservable();
 }
 updateMessage(message: string) {
  this.message.next(message);
}
}
