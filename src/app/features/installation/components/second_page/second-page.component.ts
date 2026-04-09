import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Page2FormData {
  itPerson: string;
  routerLocation: string;
  connectionType: 'cable' | 'wifi' | 'both' | '';
  cableHole: string;
  runCable: string;
  counterHole: string;
  seeWifi: string;
  wifiName: string;
  internetRightAway: string;
}

@Component({
  selector: 'app-second-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './second-page.component.html',
  styleUrl: './second-page.component.css'
})
export class SecondPageComponent {
  formData: Page2FormData = {
    itPerson: '',
    routerLocation: '',
    connectionType: '',
    cableHole: '',
    runCable: '',
    counterHole: '',
    seeWifi: '',
    wifiName: '',
    internetRightAway: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Page 2 Data Submitted:', this.formData);
    
    // Basic structural validation
    if (!this.formData.itPerson || !this.formData.routerLocation || !this.formData.connectionType) {
      alert('Please fill in the core IT & Network Readiness questions.');
      return;
    }

    if (!this.formData.internetRightAway) {
      alert('Please complete all conditional questions and the final section check.');
      return;
    }

    alert('Page 2 Form submitted successfully! Next up: Page 3 Integration.');
    // Here we will navigate to page 3 once it's created:
    // this.router.navigate(['/third-page']);
  }

  saveAsDraft() {
    localStorage.setItem('installationPage2Draft', JSON.stringify(this.formData));
    alert('Draft saved successfully!');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
