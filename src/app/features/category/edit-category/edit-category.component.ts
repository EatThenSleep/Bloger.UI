import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  id: string | null = null;
  paramSubscription?: Subscription
  editCategorySubscription?: Subscription
  deleteCategorySubscription?: Subscription
  category?: Category

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id')

        if(this.id){
          // get the data from the API for this category Id
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (response) => {
                this.category = response
            }
          })
        }
      }
    })
  }

  onFormSubmit(){
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? ''
    }

    // pass this object to service
    if(this.id){
      this.editCategorySubscription = this.categoryService.updateCategory(this.id, updateCategoryRequest)
        .subscribe({
          next: (response) => {
              this.router.navigateByUrl('/admin/categories')
          }
        })
    }
  }

  onDelete(){
    if(this.id){
      this.deleteCategorySubscription = this.categoryService.deleteCategory(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/categories')
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe()
    this.editCategorySubscription?.unsubscribe()
    this.deleteCategorySubscription?.unsubscribe()
  }
}
