import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Functions } from '../types/functions.enum';
import { lastValueFrom, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly FUNCTION_URL =
    'https://us-central1-vocabify-3d855.cloudfunctions.net/';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private async getAuthorizationHeader() {
    const options = {
      headers: {
        Authorization: 'Bearer ' + (await this.authService.getToken()),
      },
    };
    return options;
  }

  async post(functionName: Functions, body: any): Promise<any> {
    const resp = this.httpClient.post<any>(
      this.FUNCTION_URL + functionName,
      body,
      await this.getAuthorizationHeader()
    );
    return await lastValueFrom(resp);
  }

  async put(functionName: Functions, body: any): Promise<any> {
    const resp = this.httpClient.put<any>(this.FUNCTION_URL + functionName, body, await this.getAuthorizationHeader());
    return (await lastValueFrom(resp));
  }
}
