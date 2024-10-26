import { TestBed } from '@angular/core/testing';

import { DiagramsService } from './diagrams.service';

describe('DiagramsService', () => {
  let service: DiagramsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
