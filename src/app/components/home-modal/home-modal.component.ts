import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.css'],
})
export class HomeModalComponent {
  constructor(private dialogRef: MatDialogRef<HomeModalComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
