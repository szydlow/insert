import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MoviesDataService } from '../../services/movies-data.service';
import { SearchItemModel } from '../../models/SearchItem.model';
import { SearchResultModel } from '../../models/SearchResult.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageBarComponent } from '../message-bar/message-bar.component';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  moviesData: SearchItemModel[] = [];
  dataLength: number = 0;
  actualSearchTitle: string;

  constructor(
    private _moviesDataService: MoviesDataService, 
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this._moviesDataService.searchResult.subscribe((data: SearchResultModel) => {
      if (data.Search) {
        this._updateMovieData(data);
      } else if (data.Error) {
        this._snackBar.openFromComponent(MessageBarComponent, {
          data: data.Error,
          duration: 2000,
        });
      }
       else {
        this._snackBar.openFromComponent(MessageBarComponent, {
          data: "Something went wrong",
          duration: 2000,
        });
      }
    })
  }

  ngOnDestroy() {
    this._moviesDataService.searchResult.unsubscribe();
  }

  private _updateMovieData(data: SearchResultModel) {
    if (this._moviesDataService.searchParams.nextPage === 2) {
      this.moviesData = data.Search;
      this.viewport.scrollToIndex(0);
      this.actualSearchTitle = this._moviesDataService.searchParams.title;
    } else {
      this.moviesData = [...this.moviesData, ...data.Search];
    }
    this.dataLength = parseInt(data.totalResults);
  }

  private _handleScrolledIndexChange() {
    if (this._isAllDataFetched()) return;
    if (!this._isValidTitle()) return;
    if (!this._isValidPage()) return;
    if (this.viewport.getDataLength() === this.viewport.getRenderedRange().end) {
      this._moviesDataService.fetchNextPage();
    }
  }

  private _isAllDataFetched() {
    return this.viewport.getDataLength() === this.dataLength;
  }

  private _isValidTitle() {
    return this._moviesDataService.searchParams.title === this.actualSearchTitle;
  }

  private _isValidPage() {
    return this._moviesDataService.searchParams.nextPage === Math.floor(this.viewport.getDataLength() / PAGE_SIZE) + 1;
  }

}
