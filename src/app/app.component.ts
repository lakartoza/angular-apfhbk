import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, merge, switchMap, tap, delay, skip } from 'rxjs/operators';
import { concat, of, Observable, BehaviorSubject, timer } from 'rxjs';


@Component({
  selector: 'my-app',
  template: ` 
    Bitcoin price: {{ polledBitcoin$ | async }}
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  polledBitcoin$: Observable<number>;
  load$ = new BehaviorSubject('');


  constructor(private http: HttpClient) {
      
  }

  ngOnInit() {
    const bitcoin$ = this.http.get('https://blockchain.info/ticker');

    const whenToRefresh$ = of('').pipe(
      delay(5000),
      tap(_ => this.load$.next('')),
      skip(1),
    );

    const poll$ = concat(bitcoin$, whenToRefresh$);

    this.polledBitcoin$ = this.load$.pipe(
       concatMap(_ => poll$),
       map((response: {EUR: {last: number}}) => response.EUR.last),
    );
  }
}
