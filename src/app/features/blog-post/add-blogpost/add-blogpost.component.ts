import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  createBlogPostSubscription?: Subscription
  imageSelectorSubscription?: Subscription
  categories$?: Observable<Category[]>

  isImageSelectorVisible: boolean = false;

  constructor(private blogPostService: BlogPostService,
            private router: Router,
            private categoryService: CategoryService,
            private imageService: ImageService
  ){
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories()

    this.imageSelectorSubscription = this.imageService.onSelectImage().subscribe({
      next: (selectedImage) => {
        if(this.model){
          this.model.featuredImageUrl = selectedImage.url
          this.toggleImageSelector()
        }
      }
    })
  }

  onFormSubmit(){
    console.log(this.model)
    this.createBlogPostSubscription = this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response) => {
          this.router.navigateByUrl('/admin/blogposts')
      }
    })
  }

  toggleImageSelector(): void{
    this.isImageSelectorVisible = !this.isImageSelectorVisible
  }

  ngOnDestroy(): void {
    this.createBlogPostSubscription?.unsubscribe()
    this.imageSelectorSubscription?.unsubscribe()
  }
}
