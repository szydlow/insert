import { Injectable } from '@angular/core';
import { SearchResultModel } from '../models/SearchResult.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SearchParamsModel } from '../models/SearchParams.model';
import { Subject, Observable, throwError } from 'rxjs';
import { take, retry, catchError } from 'rxjs/operators';
import { MovieDetailsModel } from '../models/MovieDetails.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageBarComponent } from '../components/message-bar/message-bar.component';

enum queryType {
  List,
  Details
}

@Injectable({
  providedIn: 'root'
})
export class MoviesDataService {

  searchParams: SearchParamsModel = {
    apiKey: environment.api_key,
    title: "show",
    type: "movie",
    year: null,
    nextPage: 1,
  };
  searchResult: Subject<SearchResultModel> = new Subject();
  loading: boolean = false;

  constructor(
    private _http: HttpClient, 
    private _snackBar: MatSnackBar
  ) { }

  fetchInitialPage() {
    this.loading = true;
    this.searchParams.nextPage = 1;
    this._fetchPageData();
  }

  fetchNextPage() {
    this._fetchPageData();
  }

  fetchMovieDetails(movieId: string): Observable<MovieDetailsModel> {
    return this._http.get<MovieDetailsModel>(environment.api_url + this._buildParamsString(queryType.Details, movieId))
      .pipe(
        take(1),
        retry(1),
        catchError(this._handleError)
      );
  }
  
  private _fetchPageData() {
    this._http.get(environment.api_url + this._buildParamsString(queryType.List))
      .pipe(
        take(1),
        retry(1),
        catchError(this._handleError)
      )
      .subscribe((data: SearchResultModel) => {
        this.loading = false;
        this.searchParams.nextPage++;
        this.searchResult.next(data)
      });
  }

  private _buildParamsString(type: queryType, movieId?: string) {
    let paramsString = "?apikey=".concat(this.searchParams.apiKey);
    if (type === queryType.List) {
      paramsString += "&s=".concat(this.searchParams.title);
      paramsString += "&type=".concat(this.searchParams.type);
      if (this.searchParams.year) paramsString +="&y=".concat(this.searchParams.year.toString());
      paramsString += "&page=".concat(this.searchParams.nextPage.toString());
    }
    else if (type === queryType.Details) {
      paramsString += "&i=".concat(movieId);
    }
    return paramsString;
  }

  private _handleError = (error: any) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Something went wrong`;
    } else {
      // server-side error
      errorMessage = `Server error`;
    }
    this._snackBar.openFromComponent(MessageBarComponent, {
      data: errorMessage,
      duration: 2000,
    });
    return throwError(errorMessage);
  }

}
