import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take, catchError } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Injectable()
export class HomePageResolver implements Resolve<string> {
    constructor(private angularFireMessaging: AngularFireMessaging) {
    }

    resolve(): Observable<string> {
        let deviceId = localStorage.getItem('deviceId');

        if (deviceId === null || (deviceId && deviceId.length <= 20) ) {
            return this.angularFireMessaging.requestToken.pipe(
                take(1),
                mergeMap(token => {
                    if (token) {
                        // console.log(token);
                        localStorage.setItem('deviceId', token);
                        return of(token);
                    } else { // id not found
                        deviceId = Math.random().toString(36).substring(2);
                        localStorage.setItem('deviceId', deviceId);
                        return deviceId;
                    }
                }),
                catchError(err => {
                    console.log(err);
                    deviceId = Math.random().toString(36).substring(2);
                    localStorage.setItem('deviceId', deviceId);
                    return deviceId;
                }),
            );
        } else {
            return of(deviceId);
        }
    }
}
