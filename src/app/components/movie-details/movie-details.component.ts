import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MoviesDataService } from '../../services/movies-data.service';
import { SearchItemModel } from '../../models/SearchItem.model';
import { MovieDetailsModel } from '../../models/MovieDetails.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnChanges {

  @Input('movieData') movieData: SearchItemModel;
  details$: Observable<MovieDetailsModel>;

  constructor(private _moviesDataService: MoviesDataService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.details$ = this._moviesDataService.fetchMovieDetails(this.movieData.imdbID);
  }

  parseRatingValue(rating) {
    if (rating.indexOf("%") === -1) {
      rating = rating.split("/").reduce((acc, val) => acc / val) * 100;
    }
    else {
      rating = parseFloat(rating);
    }
    return rating / 20;
  }

}
