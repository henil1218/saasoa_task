import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PropaneFormData {
  saasoapId: string;
  primaryUser: string;
  companyLegalName: string;
  storeName: string;
  salesTax: string;
  einNumber: string;
  email: string;
  billingInfoSame: boolean;
  payableContactInfoSame: boolean;
  billingEmailAddress: string;
  payableContactName: string;
  billingAddress: string;
  payableContactPhone: string;
  billingCity: string;
  billingState: string;
  billingZipcode: string;
  payableContactEmail: string;
  agreeTerms: boolean;
  signHere: string;
  date: string;
  paymentMethod: string;
  propaneServiceType: string;
  exchangePrice: string;
  purchasePrice: string;
}

@Component({
  selector: 'app-propane-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propane-form.component.html',
  styleUrl: './propane-form.component.css'
})
export class PropaneFormComponent {
  constructor(private router: Router) {}

  showFullTerms = false;

  formData: PropaneFormData = {
    saasoapId: '',
    primaryUser: '',
    companyLegalName: '',
    storeName: '',
    salesTax: '',
    einNumber: '',
    email: '',
    billingInfoSame: false,
    payableContactInfoSame: false,
    billingEmailAddress: '',
    payableContactName: '',
    billingAddress: '',
    payableContactPhone: '',
    billingCity: '',
    billingState: '',
    billingZipcode: '',
    payableContactEmail: '',
    agreeTerms: false,
    signHere: '',
    date: '',
    paymentMethod: '',
    propaneServiceType: '',
    exchangePrice: '',
    purchasePrice: ''
  };

  primaryUserOptions = ['Roy Patel', 'Keri Patel', 'Mary Patel', 'Robert Patel'];
  paymentMethodOptions = ['POD (Check or Money Orders Only. No Cash)', 'Bank Draft', 'Credit Card on File', 'Credit'];
  propaneServiceTypeOptions = ['New Installation', 'Exchange Service', 'Purchase Service', 'Maintenance'];

  termsText = `1. Term: The term of this Agreement shall be valid between October 1st, 2024 - September 30th, 2026. On expiration of the initial term of this Agreement or subsequent renewals, this Agreement shall automatically renew on a month-to-month basis until a new SAASOA agreement is signed. SAASOA will notify you 30 days prior to expiration of the current contract via Member Portal to provide you with an opportunity to renew.

2. Pricing: Pricing will be fixed for the duration of the agreement.

3. Equipment/Minimum Usage: Company will lease and install cabinet displays, merchandising, cylinders, and locks as determined by the agreement terms.

4. Payment Terms: Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly finance charge.

5. Termination: Either party may terminate this Agreement with 30 days written notice after the initial term expires.`;

  onBillingInfoSameChange() {
    if (this.formData.billingInfoSame) {
      this.formData.billingEmailAddress = this.formData.email;
    }
  }

  onPayableContactInfoSameChange() {
    if (this.formData.payableContactInfoSame) {
      // Auto-fill payable contact info from primary contact if needed
    }
  }

  toggleTerms() {
    this.showFullTerms = !this.showFullTerms;
  }

  onSubmit() {
    if (!this.formData.agreeTerms) {
      alert('Please agree to the Terms & Conditions before submitting.');
      return;
    }

    if (!this.formData.saasoapId || !this.formData.companyLegalName ||
        !this.formData.storeName || !this.formData.signHere || !this.formData.date) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Propane Form Submitted:', this.formData);
    alert('Propane Document submitted successfully! Added to Store Documents.');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
