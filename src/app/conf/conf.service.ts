import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfService {
  conf: BehaviorSubject<any> = new BehaviorSubject<any>(null);
}
