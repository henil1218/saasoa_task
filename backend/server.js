const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import database module

// Initialize Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Node.js API is running successfully!'
    });
});

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Define the port, defaulting to 3000 if not provided in environment variables
const PORT = process.env.PORT || 3000;

app.post('/api/generate-pdf', async (req, res) => {
    try {
        const formData = req.body; //payload
        console.log('Received PDF generation request for:', formData.saasoapId);

        // Save data to SQLite database
        try {
            await db.insertSubmission(formData);
            console.log('Data saved to database successfully');
        } catch (dbError) {
            console.error('Failed to save data to database:', dbError);
        }

        // 1. Fetch PDF from the public folder
        const pdfPath = path.join(__dirname, '../public/SaasoaPropane2025_V2.pdf');
        const existingPdfBytes = fs.readFileSync(pdfPath);

        // 2. Load the PDF document
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // 3. Get the first page of the PDF (use pages[1] for the second page)
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // 4. Create a list of data and its Coordinates (X, Y)
        const textElements = [
            { name: 'SAASOA ID', text: formData.saasoapId, x: 88.16, y: 591.65 },
            { name: 'Company Legal Name', text: formData.companyLegalName, x: 120.94, y: 568.34 },
            { name: 'Store Name (DBA)', text: formData.storeName, x: 53.19, y: 544.3 },
            { name: 'EIN Number', text: formData.einNumber, x: 85.97, y: 520.26 },
            { name: 'Sales Tax', text: formData.salesTax, x: 413.1, y: 518.8 },

            { name: 'Store Address', text: formData.storeAddress, x: 83.79, y: 499.13 },
            { name: 'Primary Contact', text: formData.primaryUser, x: 383.96, y: 498.4 },
            { name: 'Primary Contact Phone', text: formData.storePhone, x: 343.16, y: 480.91 },
            { name: 'Store City', text: formData.storeCity, x: 47.36, y: 453.96 },
            { name: 'Store State', text: formData.storeState, x: 182.87, y: 454.69 },
            { name: 'Store Zip', text: formData.storeZipcode, x: 249.9, y: 453.96 },
            { name: 'Store Email', text: formData.email, x: 343.16, y: 454.69 },
            
            { name: 'Accounts Payable Contact', text: formData.payableContactName, x: 424.39, y: 426.59 },
            { name: 'Billing Email', text: formData.billingEmailAddress, x: 130.41, y: 408.06 },
            { name: 'Billing Address', text: formData.billingAddress, x: 91.8, y: 389.85 },
            { name: 'Billing Phone', text: formData.payableContactPhone, x: 342.43, y: 389.85 },
            { name: 'Payable Email', text: formData.payableContactEmail, x: 340.97, y: 373.09 },
            { name: 'Billing City', text: formData.billingCity, x: 47.36, y: 354.88 },
            { name: 'Billing State', text: formData.billingState, x: 182.14, y: 354.15 },
            { name: 'Billing Zip', text: formData.billingZipcode, x: 248.44, y: 354.15 },

            { name: 'Service Type Text', text: formData.propaneServiceType, x: 314.01, y: 354.15 },
            { name: 'Exchange Price', text: formData.exchangePrice, x: 274.31, y: 251.74 },
            { name: 'Purchase Price', text: formData.purchasePrice, x: 357.36, y: 252.47 }
        ];

        // Payment method checkboxes logic
        if (formData.paymentMethod) {
            if (formData.paymentMethod.includes('POD')) {
                textElements.push({ name: 'Payment: POD Mark', text: 'tick', x: 430, y: 206, isTick: true });
            }
            if (formData.paymentMethod.includes('Bank Draft')) {
                textElements.push({ name: 'Payment: Bank Draft Mark', text: 'tick', x: 430, y: 192, isTick: true });
            }
            if (formData.paymentMethod.includes('Credit Card')) {
                textElements.push({ name: 'Payment: Card on File Mark', text: 'tick', x: 430, y: 175, isTick: true });
            }
            if (formData.paymentMethod.includes('Credit (')) {
                textElements.push({ name: 'Payment: Credit Mark', text: 'tick', x: 430, y: 160, isTick: true });
            }
        }
        
        // Service Type checkboxes logic
        if (formData.propaneServiceType) {
            if (formData.propaneServiceType.includes('Cylinder')) {
                textElements.push({ name: 'Service: Cylinder Mark', text: 'X', x: 499.44, y: 173.06 });
            }
            if (formData.propaneServiceType.includes('Bulk')) {
                textElements.push({ name: 'Service: Bulk Mark', text: 'X', x: 524.21, y: 185.45 });
            }
            if (formData.propaneServiceType.includes('Both')) {
                textElements.push({ name: 'Service: Both Mark', text: 'X', x: 496.52, y: 144.65 });
            }
        }

        // Print elements on the first page
        textElements.forEach(el => {
            if (el.text) {
                if (el.isTick) {
                    // Draw a tick mark using two lines
                    const tickX = el.x;
                    const tickY = el.y;
                    
                    // First short line of the tick
                    firstPage.drawLine({
                        start: { x: tickX, y: tickY + 4 },
                        end: { x: tickX + 3, y: tickY },
                        thickness: 2,
                        color: rgb(0, 0, 0),
                    });
                    
                    // Second longer line of the tick
                    firstPage.drawLine({
                        start: { x: tickX + 3, y: tickY },
                        end: { x: tickX + 8, y: tickY + 8 },
                        thickness: 2,
                        color: rgb(0, 0, 0),
                    });
                } else {
                    firstPage.drawText(String(el.text), { x: el.x, y: el.y, size: 11, color: rgb(0, 0, 0) });
                }
            }
        });

        // Signature and Date on the 2nd page
        const secondPage = pages[1];
        
        // Printed Name (Primary Contact)
        if (formData.primaryUser) {
            secondPage.drawText(String(formData.primaryUser), { x: 80.46, y: 84.59, size: 11, color: rgb(0, 0, 0) });
        }

        if (formData.signHere) {
            secondPage.drawText(String(formData.signHere), { x: 24.41, y: 64.59, size: 11, color: rgb(0, 0, 0) });
        }
        if (formData.date) {
            secondPage.drawText(String(formData.date), { x: 228.41, y: 63.13, size: 11, color: rgb(0, 0, 0) });
        }

        // 5. Save the PDF
        const pdfBytes = await pdfDoc.save();

        // 6. Send the PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Filled_Propane_Agreement.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            error: 'Failed to generate PDF', 
            details: error.message,
            stack: error.stack 
        });
    }
});

// New route to view all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await db.getAllSubmissions();
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
