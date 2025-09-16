import {
  HttpInterceptorFn,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { inject } from "@angular/core";
import { ErrorComponent } from "./error/error.component";
import { ErrorService } from "./error/error.service";
import { MatDialog } from "@angular/material/dialog";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(MatDialog);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = "An unknown error occurred!";
      if (error.error.message) {
        errorMessage = error.error.message;
      }
      dialog.open(ErrorComponent, { data: { message: errorMessage } });
      // errorService.throwError(errorMessage);
      return throwError(() => error);
    })
  );
};
