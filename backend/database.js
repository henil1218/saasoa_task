const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'propane.db');

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTable();
    }
});

// Function to create the submissions table
function createTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS propane_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saasoapId TEXT,
        primaryUser TEXT,
        companyLegalName TEXT,
        storeName TEXT,
        salesTax TEXT,
        einNumber TEXT,
        email TEXT,
        billingInfoSame BOOLEAN,
        payableContactInfoSame BOOLEAN,
        billingEmailAddress TEXT,
        payableContactName TEXT,
        billingAddress TEXT,
        payableContactPhone TEXT,
        billingCity TEXT,
        billingState TEXT,
        billingZipcode TEXT,
        payableContactEmail TEXT,
        payableUser TEXT,
        agreeTerms BOOLEAN,
        signHere TEXT,
        date TEXT,
        paymentMethod TEXT,
        propaneServiceType TEXT,
        exchangePrice TEXT,
        purchasePrice TEXT,
        storeAddress TEXT,
        storePhone TEXT,
        storeCity TEXT,
        storeState TEXT,
        storeZipcode TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    db.run(query, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "propane_submissions" is ready.');
        }
    });
}

// Function to insert a new submission
function insertSubmission(data) {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO propane_submissions (
            saasoapId, primaryUser, companyLegalName, storeName, salesTax, einNumber, email,
            billingInfoSame, payableContactInfoSame, billingEmailAddress, payableContactName,
            billingAddress, payableContactPhone, billingCity, billingState, billingZipcode,
            payableContactEmail, payableUser, agreeTerms, signHere, date, paymentMethod,
            propaneServiceType, exchangePrice, purchasePrice, storeAddress, storePhone,
            storeCity, storeState, storeZipcode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            data.saasoapId, data.primaryUser, data.companyLegalName, data.storeName, data.salesTax, data.einNumber, data.email,
            data.billingInfoSame ? 1 : 0, data.payableContactInfoSame ? 1 : 0, data.billingEmailAddress, data.payableContactName,
            data.billingAddress, data.payableContactPhone, data.billingCity, data.billingState, data.billingZipcode,
            data.payableContactEmail, data.payableUser, data.agreeTerms ? 1 : 0, data.signHere, data.date, data.paymentMethod,
            data.propaneServiceType, data.exchangePrice, data.purchasePrice, data.storeAddress, data.storePhone,
            data.storeCity, data.storeState, data.storeZipcode
        ];

        db.run(query, params, function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                reject(err);
            } else {
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                resolve(this.lastID);
            }
        });
    });
}

// Function to fetch all submissions
function getAllSubmissions() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM propane_submissions ORDER BY created_at DESC", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to fetch a single submission by ID
function getSubmissionById(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM propane_submissions WHERE id = ?", [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = {
    insertSubmission,
    getAllSubmissions,
    getSubmissionById
};
