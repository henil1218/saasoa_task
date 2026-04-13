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
      // Read Page 1 & Page 2 data from correct localStorage keys
      const prevData1 = JSON.parse(localStorage.getItem('instoreAiDraft') || '{}');
      const prevData2 = JSON.parse(localStorage.getItem('installationPage2Draft') || '{}');

      const payload = {
        page1_StoreInfo: prevData1,
        page2_NetworkInfo: prevData2,
        page3_DevicePlacement: {
          ...this.formData,
          picture: this.fileName // sending file name instead of binary for dummy API
        }
      };

      // Console ma badha 3 pages nu data show karo
      console.log('📋 Page 1 - Store Info:', prevData1);
      console.log('🌐 Page 2 - Network Info:', prevData2);
      console.log('📍 Page 3 - Device Placement:', { ...this.formData, picture: this.fileName });
      console.log('✅ Full Payload Submitted to PostBin:', payload);

      fetch('https://eosnhhyc0qpq22s.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        console.log('🚀 PostBin API SUCCESS: All 3 pages data sent!');
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.cdr.detectChanges();

        // Clear all drafts after success
        localStorage.removeItem('instoreAiDraft');
        localStorage.removeItem('installationPage2Draft');
        localStorage.removeItem('installationPage3Draft');

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
