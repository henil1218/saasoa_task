import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  selector: 'app-survey-end',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survey-end.html',
  styleUrls: ['./survey-end.css']
})
export class SurveyEnd implements OnInit {
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
  fileSize: string = '';
  filePreviewUrl: string | ArrayBuffer | null = null;
  showImageModal: boolean = false;
  
  // API State
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const savedData = localStorage.getItem('installationPage3Draft');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      this.formData = { ...this.formData, ...parsed, picture: null };
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.picture = file;
      this.fileName = file.name;
      
      // Calculate file size
      if (file.size < 1024 * 1024) {
        this.fileSize = (file.size / 1024).toFixed(1) + ' KB';
      } else {
        this.fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      }

      // Generate preview URL if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => this.filePreviewUrl = e.target?.result as string;
        reader.readAsDataURL(file);
      } else {
        this.filePreviewUrl = null; // Reset for non-images
      }
    }
  }

  removeFile() {
    this.formData.picture = null;
    this.fileName = '';
    this.fileSize = '';
    this.filePreviewUrl = null;
    this.showImageModal = false;
  }

  openImageModal() {
    if (this.filePreviewUrl) {
      this.showImageModal = true;
    }
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  onSubmit(form: any) {
    if (form.invalid) {
      this.submitError = 'Please answer all the required questions before submitting.';
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = '';

    try {
      // Create payload from local storage plus this page's formData
      const prevData1 = JSON.parse(localStorage.getItem('firstPageData') || '{}');
      const prevData2 = JSON.parse(localStorage.getItem('secondPageData') || '{}');
      
      const payload = {
        page1: prevData1,
        page2: prevData2,
        page3: {
          ...this.formData,
          picture: this.fileName // sending file name instead of binary for dummy API
        }
      };

      // We use native fetch with 'no-cors' mode
      // This tells the browser NOT to run CORS preflight checks, ensuring Beeceptor
      // gets the POST request without blocking it!
      
      console.log('✅ Final Prepared Details Submitted to Server:', payload);
      
      fetch('https://henil-saasoa.free.beeceptor.com', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
      .then(() => {
        // Since it's no-cors, it succeeds automatically if network is alive
        console.log('Dummy API SUCCESS: Reached Beeceptor!');
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.cdr.detectChanges();
        
        // Clear drafts after success
        localStorage.removeItem('firstPageData');
        localStorage.removeItem('secondPageData');
        localStorage.removeItem('thirdPageDraft');
        
        // Show success for a bit then redirect
        setTimeout(() => {
          console.log('Redirecting to home...');
          this.router.navigate(['/']);
        }, 2000);
      })
      .catch((error) => {
        console.error('Fetch ERROR:', error);
        this.isSubmitting = false;
        this.submitError = 'Internet connection failed. Please try again.';
        this.cdr.detectChanges();
      });
    } catch (e) {
      console.error('Logic Error:', e);
      this.isSubmitting = false;
      this.submitError = 'An unexpected error occurred while preparing your data.';
      this.cdr.detectChanges();
    }
  }

  saveAsDraft() {
    const { picture, ...draftData } = this.formData;
    localStorage.setItem('installationPage3Draft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  }

  goBack() {
    this.router.navigate(['/second-page']);
  }
}
