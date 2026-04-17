import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PDFDocument, rgb } from 'pdf-lib';


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
  constructor(private router: Router) { }

  showFullTerms = false;
  showWarningModal = true;

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
    agreeTerms: false,
    signHere: '',
    date: '',
    paymentMethod: '',
    propaneServiceType: '',
    exchangePrice: '',
    purchasePrice: ''
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
    } else {
      this.formData.email = '';
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
      const user = this.formData.primaryUser ? this.userDatabase[this.formData.primaryUser] : null;
      this.formData.billingEmailAddress = this.formData.email || (user ? user.email : '');
      if (user) {
        this.formData.billingAddress = user.address;
        this.formData.billingCity = user.city;
        this.formData.billingState = user.state;
        this.formData.billingZipcode = user.zipcode;
      }
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
      const user = this.formData.primaryUser ? this.userDatabase[this.formData.primaryUser] : null;
      this.formData.payableContactEmail = this.formData.email || (user ? user.email : '');
      if (user) {
        this.formData.payableContactPhone = user.phone;
      }
    } else {
      this.formData.payableContactName = '';
      this.formData.payableContactEmail = '';
      this.formData.payableContactPhone = '';
    }
  }

  toggleTerms() {
    this.showFullTerms = !this.showFullTerms;
  }
  async onSubmit() {
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
    alert('Propane Document submitted successfully! Added to Store Documents.');

    // Call the function to generate and download PDF
    await this.generatePDF();

    this.resetForm();
  }

  async generatePDF() {
    try {
      // 1. Fetch PDF from the public folder
      const pdfUrl = 'SaasoaPropane2025_V2.pdf';
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

      // 2. Load the PDF document
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 3. Get the first page of the PDF (use pages[1] for the second page)
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // 4. Create a list of data and its Coordinates (X, Y)
      const textElements = [
        { name: 'SAASOA ID', text: this.formData.saasoapId, x: 99, y: 580 },
        { name: 'Company Legal Name', text: this.formData.companyLegalName, x: 145, y: 567.2 },
        { name: 'Store Name (DBA)', text: this.formData.storeName, x: 74, y: 543.89 },
        { name: 'EIN Number', text: this.formData.einNumber, x: 104, y: 518.39 },
        { name: 'Sales Tax', text: this.formData.salesTax, x: 433, y: 519.12 },

        { name: 'Store Address', text: this.formData.billingAddress, x: 128, y: 497.99 },
        { name: 'Primary Contact', text: this.formData.primaryUser, x: 410, y: 498.72 },
        { name: 'Primary Contact Phone', text: this.formData.payableContactPhone, x: 363.92, y: 480.5 },
        { name: 'Store City', text: this.formData.billingCity, x: 63, y: 452.82 },
        { name: 'Store State', text: this.formData.billingState, x: 186, y: 453.55 },
        { name: 'Store Zip', text: this.formData.billingZipcode, x: 259, y: 452.82 },
        { name: 'Store Email', text: this.formData.email, x: 393, y: 453.55 },

        { name: 'Accounts Payable Contact', text: this.formData.payableContactName, x: 451, y: 425.86 },
        { name: 'Billing Email', text: this.formData.billingEmailAddress, x: 182, y: 406.92 },
        { name: 'Billing Address', text: this.formData.billingAddress, x: 140, y: 389.44 },
        { name: 'Billing Phone', text: this.formData.payableContactPhone, x: 363, y: 388.71 },
        { name: 'Payable Email', text: this.formData.payableContactEmail, x: 393, y: 371.95 },
        { name: 'Billing City', text: this.formData.billingCity, x: 63, y: 353.74 },
        { name: 'Billing State', text: this.formData.billingState, x: 188, y: 353.74 },
        { name: 'Billing Zip', text: this.formData.billingZipcode, x: 256, y: 353.74 },

        { name: 'Service Type Text', text: this.formData.propaneServiceType, x: 344, y: 353.74 },
        { name: 'Exchange Price', text: this.formData.exchangePrice, x: 308, y: 251.74 },
        { name: 'Purchase Price', text: this.formData.purchasePrice, x: 393, y: 251.74 },
        { name: 'Payment Method Text', text: this.formData.paymentMethod, x: 560, y: 159.95 }
      ];

      // Payment method checkboxes logic
      if (this.formData.paymentMethod) {
        if (this.formData.paymentMethod.includes('POD')) {
          textElements.push({ name: 'Payment: POD Mark', text: 'X', x: 513.2, y: 213.13 });
        }
        if (this.formData.paymentMethod.includes('Bank Draft')) {
          textElements.push({ name: 'Payment: Bank Draft Mark', text: 'X', x: 487.0, y: 194.19 });
        }
        if (this.formData.paymentMethod.includes('Credit Card')) {
          textElements.push({ name: 'Payment: Card on File Mark', text: 'X', x: 95.2, y: 175.25 });
        }
        if (this.formData.paymentMethod.includes('Credit (')) {
          textElements.push({ name: 'Payment: Credit Mark', text: 'X', x: 84.2, y: 160.68 });
        }
      }

      // Print elements on the first page
      textElements.forEach(el => {
        if (el.text) {
          firstPage.drawText(String(el.text), { x: el.x, y: el.y, size: 11, color: rgb(0, 0, 0) });
        }
      });

      // Signature and Date usually go on the last page
      const lastPage = pages[pages.length - 1];
      if (this.formData.signHere) {
        lastPage.drawText(String(this.formData.signHere), { x: 68.49, y: 75.55, size: 11, color: rgb(0, 0, 0) });
      }
      if (this.formData.date) {
        lastPage.drawText(String(this.formData.date), { x: 116.22, y: 75.55, size: 11, color: rgb(0, 0, 0) });
      }

      // 5. Save the PDF
      const pdfBytes = await pdfDoc.save();

      // 6. Trigger the download
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Filled_Propane_Agreement.pdf';
      link.click();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Check console.');
    }
  }

  resetForm() {
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
      agreeTerms: false,
      signHere: '',
      date: '',
      paymentMethod: '',
      propaneServiceType: '',
      exchangePrice: '',
      purchasePrice: ''
    };
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
