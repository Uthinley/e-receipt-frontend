import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    request.headers.get('X-Custom-Header');
    return next.handle(request).pipe( catchError(this.handleError) );
  }
  handleError(error: HttpErrorResponse){
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          console.error('Error Event');
      } else {
          console.log(`error status : ${error.status} ${error.statusText}`);
          switch (error.status) {
            case 401:      // login
              this.router.navigateByUrl('/login');
              break;
          }
      }
    }
    else {
        console.error('some thing else happened');
      }
    return throwError(error);
  }
}
