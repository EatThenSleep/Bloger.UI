import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  categories$?: Observable<Category[]>;
  @ViewChild('queryText') query: any;
  totalCount?: number;
  list: number[] = []
  pageNumber = 1;
  pageSize = 5;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategoryCount().subscribe({
      next: (val) => {
        this.totalCount = val;
        this.list = new Array(Math.ceil(val / this.pageSize))

        this.categories$ = this.categoryService.getAllCategories(
          this.query.nativeElement.value,
          undefined,
          undefined,
          this.pageNumber,
          this.pageSize
        );
      },
    });
  }



  onSearch() {
    this.categories$ = this.categoryService.getAllCategories(
      this.query.nativeElement.value
    );

    this.categoryService.getCategoryCount(this.query.nativeElement.value).subscribe({
      next: (val) => {
        this.totalCount = val;
        this.list = new Array(Math.ceil(val / this.pageSize))
      }
    })
  }

  sort(sortBy: string, sortDirection: string) {
    this.categories$ = this.categoryService.getAllCategories(
      this.query.nativeElement.value,
      sortBy,
      sortDirection
    );
  }

  getPage(pageNumber: number){
    this.pageNumber = pageNumber
    this.categories$ = this.categoryService.getAllCategories(
      this.query.nativeElement.value,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  getPrevPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }

    this.pageNumber--
    this.categories$ = this.categoryService.getAllCategories(
      this.query.nativeElement.value,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }

  checkContinue(): boolean{
    return this.pageNumber + 1 > this.list.length
  }

  getNextPage(){
    if(this.checkContinue()){
      return;
    }

    this.pageNumber++
    this.categories$ = this.categoryService.getAllCategories(
      this.query.nativeElement.value,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }
}
