const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function run() {
  try {
    const pdfBytes = fs.readFileSync('./public/RapidXchange_Agreement_12453.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log("PDF Fields:");
    fields.forEach(field => {
      const name = field.getName();
      const type = field.constructor.name;
      console.log(`- Name: "${name}", Type: ${type}`);
    });
  } catch (error) {
    console.error("Error reading PDF fields:", error);
  }
}

run();
