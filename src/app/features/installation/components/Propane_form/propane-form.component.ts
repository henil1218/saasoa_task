import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


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
  payableUser: string;
  agreeTerms: boolean;
  signHere: string;
  date: string;
  paymentMethod: string;
  propaneServiceType: string;
  exchangePrice: string;
  purchasePrice: string;
  // New fields to decouple "above" section from "billing/payable" sections
  storeAddress: string;
  storePhone: string;
  storeCity: string;
  storeState: string;
  storeZipcode: string;
}

@Component({
  selector: 'app-propane-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propane-form.component.html',
  styleUrl: './propane-form.component.css'
})
export class PropaneFormComponent {
  showFullTerms = false;
  showWarningModal = true;
  showPdfModal = false;
  isGeneratingPdf = false;
  formSubmittedSuccessfully = false;
  pdfUrl: SafeResourceUrl | null = null;
  rawBlobUrl: string | null = null;

  activeTab: string = 'form';
  submissions: any[] = [];
  isLoadingSubmissions: boolean = false;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  onProcess() {
    this.showWarningModal = false;
  }
  maxDate: string = new Date().toISOString().split('T')[0];

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
    payableUser: '',
    agreeTerms: false,
    signHere: '',
    date: '',
    paymentMethod: '',
    propaneServiceType: '',
    exchangePrice: '',
    purchasePrice: '',
    storeAddress: '',
    storePhone: '',
    storeCity: '',
    storeState: '',
    storeZipcode: ''
  };

  primaryUserOptions = ['Roy Patel', 'Keri Patel', 'Mary Patel', 'Robert Patel'];

  // Simulated user mapping to auto-fill additional fields
  readonly userDatabase: Record<string, any> = {
    'Roy Patel': { email: 'roy.patel@example.com', phone: '2225525666', address: '123 Main St', city: 'Atlanta', state: 'GA', zipcode: '30301' },
    'Keri Patel': { email: 'keri.patel@example.com', phone: '4561257855', address: '456 Oak Ave', city: 'Dallas', state: 'TX', zipcode: '75001' },
    'Mary Patel': { email: 'mary.patel@example.com', phone: '5412325647', address: '789 Pine Ln', city: 'Chicago', state: 'IL', zipcode: '60601' },
    'Robert Patel': { email: 'robert.patel@example.com', phone: '2541562347', address: '321 Elm St', city: 'Seattle', state: 'WA', zipcode: '98101' }
  };

  paymentMethodOptions = ['POD (Check or Money Orders Only. No Cash)', 'Bank Draft (Complete Additional Form)', 'Credit Card on File (Complete Additional Form)', 'Credit (Application Required)'];
  propaneServiceTypeOptions = ['New Application', 'Change Service'];

  termsText = `1. Term: The term of this Agreement shall be valid between October 1st, 2024 - September 30th, 2026. On expiration of the initial term of this Agreement or subsequent renewals, this Agreement shall automatically renew on a month-to-month basis until a new SAASOA agreement is signed. SAASOA will notify you 30 days prior to expiration of the current contract via Member Portal to provide you with an opportunity to renew.

2. Pricing: Pricing will be fixed for the duration of the agreement.

3. Equipment/Minimum Usage: Company will lease and install cabinet displays, merchandising, cylinders, and locks as determined by the agreement terms.

4. Payment Terms: Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly finance charge.

5. Termination: Either party may terminate this Agreement with 30 days written notice after the initial term expires.`;

  onPrimaryUserChange() {
    if (this.formData.primaryUser && this.userDatabase[this.formData.primaryUser]) {
      const user = this.userDatabase[this.formData.primaryUser];
      this.formData.email = user.email;
      
      // Populate store fields (above section)
      this.formData.storeAddress = user.address;
      this.formData.storePhone = user.phone;
      this.formData.storeCity = user.city;
      this.formData.storeState = user.state;
      this.formData.storeZipcode = user.zipcode;
      
      // Auto-select checkboxes when primary user is selected
      this.formData.billingInfoSame = true;
      this.formData.payableContactInfoSame = true;
    } else {
      this.formData.email = '';
      this.formData.storeAddress = '';
      this.formData.storePhone = '';
      this.formData.storeCity = '';
      this.formData.storeState = '';
      this.formData.storeZipcode = '';
      this.formData.billingInfoSame = false;
      this.formData.payableContactInfoSame = false;
    }

    if (this.formData.billingInfoSame) {
      this.onBillingInfoSameChange();
    }
    if (this.formData.payableContactInfoSame) {
      this.onPayableContactInfoSameChange();
    }
  }

  onEmailChange() {
    if (this.formData.billingInfoSame) {
      this.formData.billingEmailAddress = this.formData.email;
    }
    if (this.formData.payableContactInfoSame) {
      this.formData.payableContactEmail = this.formData.email;
    }
  }

  onBillingInfoSameChange() {
    if (this.formData.billingInfoSame) {
      this.formData.billingEmailAddress = this.formData.email;
      this.formData.billingAddress = this.formData.storeAddress;
      this.formData.billingCity = this.formData.storeCity;
      this.formData.billingState = this.formData.storeState;
      this.formData.billingZipcode = this.formData.storeZipcode;
    } else {
      this.formData.billingEmailAddress = '';
      this.formData.billingAddress = '';
      this.formData.billingCity = '';
      this.formData.billingState = '';
      this.formData.billingZipcode = '';
    }
  }

  onPayableContactInfoSameChange() {
    if (this.formData.payableContactInfoSame) {
      this.formData.payableContactName = this.formData.primaryUser;
      this.formData.payableContactEmail = this.formData.email;
      this.formData.payableContactPhone = this.formData.storePhone;
      this.formData.payableUser = this.formData.primaryUser;
    } else {
      this.formData.payableContactName = '';
      this.formData.payableContactEmail = '';
      this.formData.payableContactPhone = '';
      this.formData.payableUser = '';
    }
  }

  onPayableUserChange() {
    // Keep selection but do not auto-fill fields as per user request
  }

  toggleTerms() {
    this.showFullTerms = !this.showFullTerms;
  }

  async onSubmit(form: NgForm) {
    if (!this.formData.agreeTerms) {
      alert('Please agree to the Terms & Conditions before submitting.');
      return;
    }

    if (!this.formData.saasoapId || !this.formData.companyLegalName ||
      !this.formData.storeName || !this.formData.signHere || !this.formData.date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Custom validations
    const numRegex = /^[0-9]+$/;
    if (this.formData.saasoapId && !numRegex.test(this.formData.saasoapId)) {
      alert('SAASOA ID must contain only numbers.');
      return;
    }

    const wordRegex = /^[a-zA-Z\s]+$/;
    if (this.formData.companyLegalName && !wordRegex.test(this.formData.companyLegalName)) {
      alert('Company Legal Name must contain only text/words.');
      return;
    }
    if (this.formData.storeName && !wordRegex.test(this.formData.storeName)) {
      alert('Store Name must contain only text/words.');
      return;
    }
    if (this.formData.payableContactName && !wordRegex.test(this.formData.payableContactName)) {
      alert('Payable Contact Name must contain only text/words.');
      return;
    }
    if (this.formData.signHere && !wordRegex.test(this.formData.signHere)) {
      alert('Signature (Sign Here) must contain only text/words.');
      return;
    }
    if (this.formData.billingCity && !wordRegex.test(this.formData.billingCity)) {
      alert('Billing City must contain only text/words.');
      return;
    }
    if (this.formData.billingState && !wordRegex.test(this.formData.billingState)) {
      alert('Billing State must contain only text/words.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (this.formData.payableContactPhone && !phoneRegex.test(this.formData.payableContactPhone)) {
      alert('Payable Contact Phone must be exactly 10 digits long.');
      return;
    }

    console.log('Propane Form Submitted:', this.formData);
    this.isGeneratingPdf = true;

    // Capture data
    const dataToSubmit = { ...this.formData };

    try {
      // Start generation
      await this.generatePDF(dataToSubmit, false);
      
      // Immediately show success view as requested
      this.formSubmittedSuccessfully = true;
      this.resetForm(form);
    } catch (e) {
      console.error(e);
      alert('Error during submission. Please check your connection.');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  async generatePDF(data: any, showModal: boolean = true) {
    try {
      const apiUrl = 'http://localhost:3000/api/generate-pdf';
      
      const blob = await firstValueFrom(
        this.http.post(apiUrl, data, { responseType: 'blob' }).pipe(
          timeout(15000) // 15 seconds timeout
        )
      );

      const blobUrl = window.URL.createObjectURL(blob);
      this.rawBlobUrl = blobUrl;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      
      if (showModal) {
        this.showPdfModal = true;
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      // If it fails, we still let the user know if they try to view it
      this.pdfUrl = null;
    }
  }

  openPreview() {
    if (this.rawBlobUrl) {
      window.open(this.rawBlobUrl, '_blank');
    } else {
      alert('PDF is still being generated or failed. Please wait a moment and try again.');
    }
  }

  resetForNewForm() {
    this.formSubmittedSuccessfully = false;
    this.showWarningModal = true;
    this.pdfUrl = null;
    this.rawBlobUrl = null;
  }

  closePdfModal() {
    this.showPdfModal = false;
    this.pdfUrl = null;
  }

  async switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'details') {
      await this.fetchSubmissions();
    }
  }

  async fetchSubmissions() {
    this.isLoadingSubmissions = true;
    try {
      const apiUrl = 'http://localhost:3000/api/submissions';
      this.submissions = await firstValueFrom(this.http.get<any[]>(apiUrl));
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to load store details.');
    } finally {
      this.isLoadingSubmissions = false;
    }
  }

  viewPdf(id: number) {
    const url = `http://localhost:3000/api/generate-pdf/${id}`;
    window.open(url, '_blank');
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
    this.formData = {
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
      payableUser: '',
      agreeTerms: false,
      signHere: '',
      date: '',
      paymentMethod: '',
      propaneServiceType: '',
      exchangePrice: '',
      purchasePrice: '',
      storeAddress: '',
      storePhone: '',
      storeCity: '',
      storeState: '',
      storeZipcode: ''
    };
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
