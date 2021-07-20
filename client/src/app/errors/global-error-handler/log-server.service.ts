import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogServer } from './server-log';
import { environment } from '../../../environments/environment';

const API = environment.LOG_SERVER_URL;

@Injectable({ providedIn: 'root' })
export class LogServerService {

    constructor(private http: HttpClient) { }

    log(logServer: LogServer) {
        return this.http.post(API + '/infra/log', logServer);
    }

}