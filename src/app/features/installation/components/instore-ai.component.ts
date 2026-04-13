import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}

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

    // Zip Code Validation: Exactly 5 or 9 numbers, no words
    const zipRegex = /^\d+$/;
    if (!zipRegex.test(data.zip)) {
       alert('Zip code must contain ONLY numbers.');
       return;
    }

    // Phone Number Validation: Exactly 10 numbers
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.contactPhone)) {
       alert('Phone number must be EXACTLY 10 digits without any spaces or special characters.');
       return;
    }

    // Name and Location Validation: Only words, no numbers allowed
    const wordsOnlyRegex = /^[A-Za-z\s]+$/;
    if (!wordsOnlyRegex.test(data.city)) {
       alert('City must contain only words, no numbers.');
       return;
    }
    if (!wordsOnlyRegex.test(data.state)) {
       alert('State must contain only words, no numbers.');
       return;
    }
    if (!wordsOnlyRegex.test(data.contactName)) {
       alert('Store Contact Name must contain only words, no numbers.');
       return;
    }
    if (data.chainName && !wordsOnlyRegex.test(data.chainName)) {
       alert('Chain Name must contain only words, no numbers.');
       return;
    }

    // Save page 1 data to localStorage before navigating
    localStorage.setItem('instoreAiDraft', JSON.stringify(data));
    
    // Navigate to second page
    this.router.navigate(['/second-page']);
  }

  saveAsDraft() {
    const data = this.formData;
    console.log('Draft Saved:', data);
    
    // Save to localStorage
    localStorage.setItem('instoreAiDraft', JSON.stringify(data));
    alert('Draft saved successfully!');
  }
}