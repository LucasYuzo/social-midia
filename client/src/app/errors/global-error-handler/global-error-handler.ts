import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user/user.service';
import { environment } from 'src/environments/environment';
import * as StackTrace from 'stacktrace-js';
import { LogServerService } from './log-server.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: any): void {

        const location = this.injector.get(LocationStrategy);

        const userService = this.injector.get(UserService);

        const logServerService = this.injector.get(LogServerService);

        const router = this.injector.get(Router);

        const zone = this.injector.get(NgZone);

        const url = location instanceof PathLocationStrategy ? location.path() : '';

        const message = error.message ? error.message : error.toString();

        if (environment.production) zone.run(() => router.navigate(['/error']));

        StackTrace
        .fromError(error)
        .then(stackFrames => {
            const stackAsString = stackFrames
                .map(stackFrame => stackFrame.toString())
                .join('\n');

            console.error(message);
            console.error(stackAsString);
            logServerService.log(
                {
                    message,
                    url,
                    userName: userService.getUserName(),
                    stack: stackAsString
                }
            ).subscribe(
                () => console.log('Error logged on server'),
                err => {
                    console.log(err);
                    console.log('Fail to send error log to server');
                }
            );
        });

    }

}