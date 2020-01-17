import { TestBed } from '@angular/core/testing';

import { MoviesDataService } from './movies-data.service';

describe('MoviesDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoviesDataService = TestBed.get(MoviesDataService);
    expect(service).toBeTruthy();
  });
});
