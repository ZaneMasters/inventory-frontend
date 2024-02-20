import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit{
  

  estadoForm: String = "";



  public categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private dialogRef= inject(MatDialogRef);
  private categoryService = inject(CategoryService);
  public data = inject(MAT_DIALOG_DATA);
  
  ngOnInit(): void {

    this.estadoForm= "Agregar";

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })

    console.log(this.data);

    if(this.data != null){
      this.updateForm(this.data);
      this.estadoForm = "Actualizar"
    }
  }


  onSave(){
    let data ={
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }
    if(this.data != null){
      this.categoryService.updateCategorie(data, this.data.id)
              .subscribe((data:any)=>{
                this.dialogRef.close(1);
              }, (error:any)=>{
                this.dialogRef.close(2);
              })
    }else{

      this.categoryService.saveCategorie(data)
            .subscribe(data => {
              console.log(data);
              this.dialogRef.close(1);
            }, (error:any) =>{
              this.dialogRef.close(2);
            })
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required]
    })
  }

}
