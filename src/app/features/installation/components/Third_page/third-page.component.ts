import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ThirdPageFormData {
  spaceForDevice: string;
  unclutteredSpace: string;
  publicArea: string;
  outletWithin5ft: string;
  cablesConcealed: string;
  mountingAllowed: string;
  picture: File | null;
}

@Component({
  selector: 'app-third-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-page.component.html'
})
export class ThirdPageComponent implements OnInit {
  formData: ThirdPageFormData = {
    spaceForDevice: '',
    unclutteredSpace: '',
    publicArea: '',
    outletWithin5ft: '',
    cablesConcealed: '',
    mountingAllowed: '',
    picture: null
  };

  fileName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedData = localStorage.getItem('installationPage3Draft');
    if (savedData) {
      // Parse basic fields. Note: File objects cannot be directly stringified into JSON so picture will be null.
      const parsed = JSON.parse(savedData);
      this.formData = { ...this.formData, ...parsed, picture: null };
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.picture = file;
      this.fileName = file.name;
    }
  }

  onSubmit() {
    console.log('Page 3 Data Submitted:', this.formData);
    alert('Questionnaire Completed and Submitted!');
    // Redirect or perform final submission logic here.
  }

  saveAsDraft() {
    // Save draft excluding File object
    const { picture, ...draftData } = this.formData;
    localStorage.setItem('installationPage3Draft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  }

  goBack() {
    this.router.navigate(['/second-page']);
  }
}
