import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';

export interface Category{
  description: string;
  id:number;
  name: string;
}



@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {

  private fb = inject(FormBuilder);
  private dialogRef= inject(MatDialogRef);
  private categoryService = inject(CategoryService);
  public data = inject(MAT_DIALOG_DATA);
  private productService = inject(ProductService);
  public productForm!: FormGroup;

  estadoForm: String = "";
  categories: Category[] =[];
  selectedFile: any;
  nameImg: String="";

  ngOnInit(): void {


    this.getCategories();
    this.estadoForm = "Agregar"

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required]
    })

  }

  onSave(){
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      category: this.productForm.get('category')?.value,
      account: this.productForm.get('account')?.value,
      picture: this.selectedFile
    }

    const uploadImageData= new FormData();
    uploadImageData.append('picture',data.picture, data.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('account',data.account);
    uploadImageData.append('categoryId',data.category);

    this.productService.saveProduct(uploadImageData).subscribe ((data:any) =>{
      this.dialogRef.close(1);
    }, (error:any) =>{
      this.dialogRef.close(2);
    })

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  getCategories(){
    this.categoryService.getCategories().subscribe((data:any) =>{
      this.categories = data.categoryResponse.category;
    }, (error: any) =>{
      console.log("error al consultar categorias");
    })
  }

  onFileChanged(event: any){
    this.selectedFile=event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;

  }

}
