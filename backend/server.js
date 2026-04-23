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

async function generatePdfBuffer(formData) {
    // 1. Fetch PDF from the public folder
    const pdfPath = path.join(__dirname, '../public/SaasoaPropane2025_V2.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // 2. Load the PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3. Get the pages
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // 4. Create a list of data and its Coordinates (X, Y)
    const textElements = [
        { name: 'SAASOA ID', text: formData.saasoapId, x: 87.16, y: 588 },
        { name: 'Company Legal Name', text: formData.companyLegalName, x: 119.94, y: 564},
        { name: 'Store Name (DBA)', text: formData.storeName, x: 52.19, y: 540 },
        { name: 'EIN Number', text: formData.einNumber, x: 83.97, y: 516 },
        { name: 'Sales Tax', text: formData.salesTax, x: 411.1, y: 516 },

        { name: 'Store Address', text: formData.storeAddress, x: 85, y: 495 },
        { name: 'Primary Contact', text: formData.primaryUser, x: 382.96, y: 495 },
        { name: 'Primary Contact Phone', text: formData.storePhone, x: 342.16, y: 477 },
        { name: 'Store City', text: formData.storeCity, x: 46.36, y: 450 },
        { name: 'Store State', text: formData.storeState, x: 181.87, y: 450 },
        { name: 'Store Zip', text: formData.storeZipcode, x: 248.9, y: 450 },
        { name: 'Store Email', text: formData.email, x: 341.16, y: 450 },
        
        { name: 'Accounts Payable Contact', text: formData.payableContactName, x: 423.39, y: 422 },
        { name: 'Billing Email', text: formData.billingEmailAddress, x: 131, y: 404 },
        { name: 'Billing Address', text: formData.billingAddress, x: 92, y: 386 },
        { name: 'Billing Phone', text: formData.payableContactPhone, x: 341.43, y: 386 },
        { name: 'Payable Email', text: formData.payableContactEmail, x: 339.97, y: 369 },
        { name: 'Billing City', text: formData.billingCity, x: 46.36, y: 350 },
        { name: 'Billing State', text: formData.billingState, x: 181.14, y: 350 },
        { name: 'Billing Zip', text: formData.billingZipcode, x: 247.44, y: 350 },

        { name: 'Service Type Text', text: formData.propaneServiceType, x: 313.01, y: 353 },
        { name: 'Exchange Price', text: formData.exchangePrice, x: 300, y: 247 },
        { name: 'Purchase Price', text: formData.purchasePrice, x: 383, y: 247 }
    ];

    // Payment method checkboxes logic
    if (formData.paymentMethod) {
        if (formData.paymentMethod.includes('POD')) {
            textElements.push({ name: 'Payment: POD Mark', text: 'tick', x: 430, y: 205, isTick: true });
        }
        if (formData.paymentMethod.includes('Bank Draft')) {
            textElements.push({ name: 'Payment: Bank Draft Mark', text: 'tick', x: 430, y: 190, isTick: true });
        }
        if (formData.paymentMethod.includes('Credit Card')) {
            textElements.push({ name: 'Payment: Card on File Mark', text: 'tick', x: 430, y: 174, isTick: true });
        }
        if (formData.paymentMethod.includes('Credit (')) {
            textElements.push({ name: 'Payment: Credit Mark', text: 'tick', x: 430, y: 159, isTick: true });
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
                const tickX = el.x;
                const tickY = el.y;
                firstPage.drawLine({
                    start: { x: tickX, y: tickY + 4 },
                    end: { x: tickX + 3, y: tickY },
                    thickness: 2,
                    color: rgb(0, 0, 0),
                });
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
    if (formData.primaryUser) {
        secondPage.drawText(String(formData.primaryUser), { x: 80.46, y: 81, size: 11, color: rgb(0, 0, 0) });
    }
    if (formData.signHere) {
        secondPage.drawText(String(formData.signHere), { x: 22, y: 59, size: 11, color: rgb(0, 0, 0) });
    }
    if (formData.date) {
        secondPage.drawText(String(formData.date), { x: 224, y: 59, size: 11, color: rgb(0, 0, 0) });
    }

    // 5. Save and return PDF bytes
    return await pdfDoc.save();
}

app.post('/api/generate-pdf', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Received PDF generation request for:', formData.saasoapId);

        // Save data to SQLite database
        try {
            await db.insertSubmission(formData);
            console.log('Data saved to database successfully');
        } catch (dbError) {
            console.error('Failed to save data to database:', dbError);
        }

        const pdfBytes = await generatePdfBuffer(formData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Filled_Propane_Agreement.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            error: 'Failed to generate PDF', 
            details: error.message
        });
    }
});

// Route to generate PDF by ID
app.get('/api/generate-pdf/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const formData = await db.getSubmissionById(id);
        
        if (!formData) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        const pdfBytes = await generatePdfBuffer(formData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=Filled_Propane_Agreement.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Error generating PDF by ID:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
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
