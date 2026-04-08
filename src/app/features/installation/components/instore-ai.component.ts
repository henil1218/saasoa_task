import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FormData {
  storeName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  chainName: string;
  storeHours: string;
}

@Component({
  selector: 'app-instore-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instore-ai.component.html',
  styleUrl: './instore-ai.component.css'
})
export class InstoreAiComponent {
  formData: FormData = {
    storeName: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    chainName: '',
    storeHours: ''
  };

  onSubmit() {
    const data = this.formData;
    console.log('Form Data Submitted:', data);
    
    // Validate required fields
    if (!data.storeName || !data.streetAddress || !data.city || 
        !data.state || !data.zip || !data.contactName || 
        !data.contactPhone || !data.contactEmail) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: Send to API or service
    alert('Form submitted successfully!');
  }

  saveAsDraft() {
    const data = this.formData;
    console.log('Draft Saved:', data);
    
    // Save to localStorage
    localStorage.setItem('instoreAiDraft', JSON.stringify(data));
    alert('Draft saved successfully!');
  }
}