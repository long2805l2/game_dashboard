import { Observable } from "rxjs";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";

export class AdminAuthenInterceptor implements HttpInterceptor
{
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
	{
		const idToken = localStorage.getItem("id_token");

		if (!idToken)
			return next.handle(req);
		
		const cloned = req.clone({
			headers: req.headers.set("Authorization", "Bearer " + idToken)
		});

		return next.handle(cloned);
	}
}
