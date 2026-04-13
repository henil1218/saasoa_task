import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Page2FormData {
  itPerson: string;
  routerLocation: string;
  customRouterLocation: string;
  connectionType: 'cable' | 'wifi' | 'both' | '';
  cableHole: string;
  runCable: string;
  counterHole: string;
  seeWifi: string;
  wifiName: string;
  customWifiName: string;
  wifiPassword: string;
  customWifiPassword: string;
  internetRightAway: string;
  itContactInfo: string;
  wifiTransition: string;
  findConnectedDevice: string;
  attemptFindPassword: string;
  foundWifiPassword: string;
  technicalPersonKnows: string;
  wifiTechnicalPersonContactInfo: string;
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
    customRouterLocation: '',
    connectionType: '',
    cableHole: '',
    runCable: '',
    counterHole: '',
    seeWifi: '',
    wifiName: '',
    customWifiName: '',
    wifiPassword: '',
    customWifiPassword: '',
    internetRightAway: '',
    itContactInfo: '',
    wifiTransition: '',
    findConnectedDevice: '',
    attemptFindPassword: '',
    foundWifiPassword: '',
    technicalPersonKnows: '',
    wifiTechnicalPersonContactInfo: ''
  };

  constructor(private router: Router) {}

  get isWifiFallback(): boolean {
    if (this.formData.connectionType === 'cable' || this.formData.connectionType === 'both') {
      if (this.formData.cableHole === 'No') return true;
      if (this.formData.cableHole === 'Yes' && this.formData.runCable === 'No' && this.formData.counterHole === 'Used') return true;
    }
    return false;
  }

  get needsTechnicalPerson(): boolean {
    return this.formData.attemptFindPassword === 'I was unable to get the password' || 
           this.formData.findConnectedDevice === 'No';
  }

  get showWifiQuestions(): boolean {
     return this.formData.connectionType === 'wifi' || (this.isWifiFallback && this.formData.wifiTransition === 'Continue');
  }

  get showInternetRightAway(): boolean {
    if (this.formData.connectionType === '') return false;
    
    // Terminal branches where the form should end early
    if (this.formData.connectionType === 'cable' || this.formData.connectionType === 'both') {
       if (this.formData.cableHole === 'Yes' && this.formData.runCable === 'No' && this.formData.counterHole === 'No') {
         return false;
       }
    }

    // GATING LOGIC: Wait until current branch is complete

    if (this.isWifiFallback) {
      if (this.formData.wifiTransition !== 'Continue') return false;
    }

    let inWifiQuestions = this.formData.connectionType === 'wifi' || this.isWifiFallback;

    if (inWifiQuestions) {
      if (this.formData.seeWifi === '') return false;
      if (this.formData.wifiName === '') return false;
      
      let isWaitingForPassword = this.formData.wifiName !== "I don't know" && this.formData.wifiPassword === '';
      if (isWaitingForPassword) return false;

      let needsHelp = this.formData.wifiName === "I don't know" || this.formData.wifiPassword === "I don't know";
      if (needsHelp) {
        if (this.formData.findConnectedDevice === '') return false;
        
        if (this.formData.findConnectedDevice === 'Yes') {
          if (this.formData.attemptFindPassword === '') return false;
          
          if (this.formData.attemptFindPassword === 'I found the password') {
            return true;
          } else if (this.formData.attemptFindPassword === 'I was unable to get the password') {
             if (this.formData.technicalPersonKnows === '') return false;
             if (this.formData.technicalPersonKnows === 'No') return false; 
             if (this.formData.technicalPersonKnows === 'Yes') return true;
          }
        } else if (this.formData.findConnectedDevice === 'No') {
           if (this.formData.technicalPersonKnows === '') return false;
           if (this.formData.technicalPersonKnows === 'No') return false; 
           if (this.formData.technicalPersonKnows === 'Yes') return true;
        }
      }
    } else {
      // Pure Ethernet branch
      if (this.formData.cableHole === '') return false;
      if (this.formData.cableHole === 'Yes') {
         if (this.formData.runCable === '') return false;
         if (this.formData.runCable === 'No') {
            if (this.formData.counterHole === '') return false;
         }
      }
    }

    return true;
  }

  get qNum(): {[key: string]: number} {
    let map: {[key: string]: number} = {};
    let n = 13;
    map['connectionType'] = n;

    if (this.formData.connectionType === 'cable' || this.formData.connectionType === 'both') {
      n++; map['cableHole'] = n;
      if (this.formData.cableHole === 'Yes') {
        n++; map['runCable'] = n;
        if (this.formData.runCable === 'No') {
          n++; map['counterHole'] = n;
        }
      }
    }

    if (this.isWifiFallback) {
      n++; map['wifiTransition'] = n; 
    }

    if (this.showWifiQuestions) {
      n++; map['seeWifi'] = n; 
      n++; map['wifiName'] = n; 
      
      if (this.formData.wifiName !== "I don't know") {
         n++; map['wifiPassword'] = n; 
      }

      if (this.formData.wifiName === "I don't know" || this.formData.wifiPassword === "I don't know") {
         n++; map['findConnectedDevice'] = n;
         if (this.formData.findConnectedDevice === 'Yes') {
            n++; map['attemptFindPassword'] = n;
            if (this.formData.attemptFindPassword === 'I found the password') {
               n++; map['foundWifiPassword'] = n;
            }
         }
         
         if (this.needsTechnicalPerson) {
            n++; map['technicalPersonKnows'] = n;
            if (this.formData.technicalPersonKnows !== '') {
               n++; map['wifiTechnicalPersonContactInfo'] = n;
            }
         }
      }
    }

    if (this.showInternetRightAway) {
      n++; map['internetRightAway'] = n;
      
      if (this.formData.internetRightAway === 'No') {
         n++; map['itContactInfo'] = n;
      }
    }

    return map;
  }

  onSubmit() {
    console.log('Page 2 Data Submitted:', this.formData);
    
    // Basic structural validation
    if (!this.formData.itPerson || !this.formData.routerLocation || !this.formData.connectionType) {
      alert('Please fill in the core IT & Network Readiness questions.');
      return;
    }

    if (!this.formData.internetRightAway && this.showInternetRightAway) {
      alert('Please complete all conditional questions and the final section check.');
      return;
    }

    // Save page 2 data before navigating
    localStorage.setItem('installationPage2Draft', JSON.stringify(this.formData));

    this.router.navigate(['/third-page']);
  }

  saveAsDraft() {
    localStorage.setItem('installationPage2Draft', JSON.stringify(this.formData));
    alert('Draft saved successfully!');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
