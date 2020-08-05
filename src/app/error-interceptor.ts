import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ErrorDialogComponent } from './error/error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string = 'A fatal error occured';

        if (error.error.message) {
          errorMsg = error.error.message;
        }

        this.dialog.open(ErrorDialogComponent, {
          data: {
            errorMsg,
          },
        });
        return throwError(error);
      })
    );
  }
}
