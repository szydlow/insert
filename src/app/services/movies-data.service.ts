import { Injectable } from '@angular/core';
import { SearchResultModel } from '../models/SearchResult.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SearchParamsModel } from '../models/SearchParams.model';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MoviesDataService {

  searchParams: SearchParamsModel = {
    apiKey: environment.api_key,
    title: "batman",
    type: "movie",
    year: null,
    page: 1,
  };
  searchResult: Subject<SearchResultModel> = new Subject();
  loading: boolean = false;

  constructor(private http: HttpClient) { }

  fetchData() {
    this.http.get(environment.api_url + this._buildParamsString())
      .pipe(take(1))
      .subscribe((data: SearchResultModel) => {
        this.loading = false;
        this.searchResult.next(data)
      });
  }

  fetchInitialPage() {
    this.loading = true;
    this.searchParams.page = 1;
    this.fetchData();
  }

  fetchNextPage() {
    this.searchParams.page++;
    this.fetchData();
  }

  private _buildParamsString() {
    let paramsString = "?apikey=".concat(this.searchParams.apiKey);
    paramsString += "&s=".concat(this.searchParams.title);
    paramsString += "&type=".concat(this.searchParams.type);
    if (this.searchParams.year) paramsString +="&y=".concat(this.searchParams.year.toString());
    paramsString += "&page=".concat(this.searchParams.page.toString());
    return paramsString;
  }

}
