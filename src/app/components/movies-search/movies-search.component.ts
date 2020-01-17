import { Component, OnInit } from '@angular/core';
import { MoviesDataService } from '../../services/movies-data.service';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss']
})
export class MoviesSearchComponent implements OnInit {

  movieTypes: string[] = ['movie', 'series', 'episode'];

  constructor(private _moviesDataService: MoviesDataService) { }

  ngOnInit() {
  }

  search() {
    this._moviesDataService.fetchInitialPage();
  }

}
