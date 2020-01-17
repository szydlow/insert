import { Component, OnInit } from '@angular/core';
import { MoviesDataService } from '../../services/movies-data.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

const regexTitle = "[A-Za-z0-9 \-]*";

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss']
})
export class MoviesSearchComponent implements OnInit {

  movieTypes: string[] = ['movie', 'series', 'episode'];

  title = new FormControl('', [Validators.required, Validators.pattern(regexTitle)]);
  year = new FormControl('', [Validators.max(2030), Validators.min(1900)]);
  type = new FormControl('');

  searchForm = new FormGroup({
    title: this.title,
    year: this.year,
    type: this.type
  });

  constructor(private _moviesDataService: MoviesDataService) { }

  ngOnInit() {
    this.searchForm.valueChanges.pipe(debounceTime(1000)).subscribe(_ => {
      if(this.searchForm.valid) this.search();
    });
  }

  search() {
    this._moviesDataService.fetchInitialPage();
  }

}
