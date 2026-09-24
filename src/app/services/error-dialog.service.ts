import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  errShow = signal(false);
  errMessage = signal('');

  showDialog(): void {
    this.errShow.set(true);
  }

  hideDialog(): void {
    this.errShow.set(false);
  }

  setErrMessage(message: string): void {
    this.errMessage.set(message);
  }
}