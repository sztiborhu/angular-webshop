import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {Product} from '../../../shared/model/product.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

interface ProductDetail {
  name: string;
  value: string;
}

@Component({
  selector: 'app-admin-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './admin-product-dialog.component.html',
  styleUrl: './admin-product-dialog.component.scss'
})
export class AdminProductDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AdminProductDialogComponent>);
  protected data = inject(MAT_DIALOG_DATA);

  productForm: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  details: ProductDetail[] = [];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categories: [[]],
      image: ['', []]
    });

    if (this.data) {
      this.productForm.patchValue(this.data);
      if (this.data.details) {
        this.details = this.data.details.map((detail: Record<string, string>) => {
          const key = Object.keys(detail)[0] || '';
          const value = detail[key] || '';
          return { name: key, value: value };
        });
      }
    }
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const categories = this.productForm.get('categories')?.value || [];
      categories.push(value);
      this.productForm.patchValue({ categories });
    }

    event.chipInput!.clear();
  }

  removeCategory(category: string): void {
    const categories = this.productForm.get('categories')?.value || [];
    const index = categories.indexOf(category);

    if (index >= 0) {
      categories.splice(index, 1);
      this.productForm.patchValue({ categories });
    }
  }

  addDetail(): void {
    this.details.push({ name: '', value: '' });
  }

  removeDetail(index: number): void {
    this.details.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      if (this.data) {
        formValue.id = this.data.id;
      }

      // Convert details array to the required format
      formValue.details = this.details
        .filter(detail => detail.name && detail.value)
        .map(detail => ({ [detail.name]: detail.value }));

      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
 