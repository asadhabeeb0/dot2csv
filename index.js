require('dotenv').config();

const fs = require('fs');
const baseUrl = process.env.WEBSITE_URL;

const dot_numbers = [
  "1000021", "1000022", "1000025", "1000030", "1000035", "1000050", "1000058", 
  "1000061", "1000062", "1000066", "1000076", "1000077", "1000078", "1000079", 
  "100008", "1000080", "1000081", "1000093", "1000095", "1000096", "1000098", 
  "1000099", "1000101", "1000102", "1000105", "1000109", "100011", "1000120", 
  "1000122", "1000123", "1000129", "1000130", "1000132", "1000133", "1000139", 
  "1000140", "1000143", "1000144", "1000147", "1000149", "1000155", "1000156", 
  "1000158", "1000169", "1000171", "1000172", "1000174", "1000178", "1000180", 
  "1000181", "1000182"
];

async function fetchAndSaveToCSV() {
    let csvData = [];
    let headers = [];
    let isFirstRow = true;

    console.log(`Starting to fetch ${dot_numbers.length} DOT numbers...`);baseUrl

    for(let i = 0; i < dot_numbers.length; i++) {
        const dotNumber = dot_numbers[i];
        const url = baseUrl + dotNumber;
        
        try {
            console.log(`${i+1}/${dot_numbers.length} - Fetching: ${dotNumber}`);
            
            const response = await fetch(url);
            const data = await response.json();
            
            // Extrac header from first record
            if(isFirstRow) {
                headers = ['dot_number', ...Object.keys(data)];
                isFirstRow = false;
            }
            
            // Convert Data to CSV row
            const row = [dotNumber, ...Object.values(data)];
            csvData.push(row);
            
        } catch(error) {
            console.log(`Error for ${dotNumber}:`, error.message);
            // Add row in error case also
            if(isFirstRow) {
                headers = ['dot_number', 'error'];
                isFirstRow = false;
            }
            csvData.push([dotNumber, error.message]);
        }
    }

    // Creae Csv file
    let csv = headers.join(',') + '\n';
    
    csvData.forEach(row => {
        const escapedRow = row.map(cell => {
            let value = cell || '';
            if(typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += escapedRow.join(',') + '\n';
    });

    // Saving data to csv file
    fs.writeFileSync('dot_data.csv', csv, 'utf-8');
    console.log('✅ Data saved to dot_data.csv');
}

fetchAndSaveToCSV();