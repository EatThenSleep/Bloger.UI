import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
})
export class ImageSelectorComponent implements OnInit {
  private file?: File
  fileName: string = ''
  title: string = ''
  images$?: Observable<BlogImage[]>

  // refresh data in the form when upload successfully
  @ViewChild('form', {static: false}) imagesUploadForm?: NgForm

  constructor(private imageService: ImageService){

  }

  ngOnInit(): void {
    this.getImages()
  }

  onFileUploadChange(event: Event): void{
    const element = event.currentTarget as HTMLInputElement
    this.file = element.files?.[0]
  }

  uploadImage(): void{
    if(this.file && this.fileName !== '' && this.title !== ''){
      // Image Service to upload the image
      this.imageService.uploadImage(this.file, this.fileName, this.title).subscribe({
        next: (response) => {
          this.imagesUploadForm?.resetForm()
          this.getImages()
        }
      })
    }
  }

  selectImage(image: BlogImage): void{
    this.imageService.selectImage(image)
  }

  private getImages(){
    this.images$ = this.imageService.getAllImages()
  }
}
