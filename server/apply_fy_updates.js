const XLSX = require('xlsx');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseValue(val) {
    if (val === null || val === undefined) return null;
    const str = String(val);
    if (str.includes('改为')) {
        // Split by "改为" and take the last part (the new value)
        // Example: "Old改为New" -> "New"
        // Example: "2260 kN改为海平面: 230吨..." -> "海平面: 230吨..."
        return str.split('改为').pop().trim();
    }
    // If no "改为", assume the value is correct as is (or identical to DB).
    // However, since the user said "marked... like...", it's safer to only apply changes 
    // where we explicitly see the pattern OR just trust the excel content?
    // User said: "marked ... like 'XXX改为XXXX'".
    // It's possible ONLY the changed cells have this pattern? 
    // Or maybe the user *only* wants me to apply those specific changes?
    // "Please understand and remember these changes, help me modify the database"
    // The safest bet is: If it has "改为", definitely update. 
    // If it doesn't, should I overwrite? 
    // If I overwrite everything, I might revert changes made by other scripts (like image links!).
    // The Excel file has `imageUrl` column. In the sample, it is `["http://localhost:3001/images/CZ-1.jpg"]`.
    // My current DB has `["./images/rockets/CZ-1.jpg"]` (from my recent update).
    // If I overwrite `imageUrl` from Excel, I will BREAK my recent image fixes.
    // **CRITICAL**: Do NOT update `imageUrl` from these Excel files unless it explicitly says "改为".
    
    return undefined; // Signal to NOT update this field
}

async function updateRockets() {
    console.log('Processing Rockets FY...');
    const workbook = XLSX.readFile(path.join(__dirname, '../doc/rocket_database_fy.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let count = 0;
    for (const row of data) {
        if (!row.name) continue;
        
        const updateData = {};
        
        // Iterate over keys in the row
        for (const key of Object.keys(row)) {
            // Skip ID and ImageUrl (protect image links)
            if (key === 'id' || key === 'imageUrl' || key === 'createdAt' || key === 'updatedAt') continue;
            
            const cellValue = row[key];
            const newValue = parseValue(cellValue);
            
            if (newValue !== undefined) {
                // If it's a number in DB schema but string in Excel (after split), we might need conversion.
                // But Prisma schema has Float for height, diameter, mass, leoCapacity...
                // The "改为" logic produces a string.
                // If the field is Float, we try to parseFloat.
                
                // Check schema type (hardcoded simple check)
                const floatFields = ['height', 'diameter', 'mass', 'leoCapacity', 'gtoCapacity', 'marsCapacity', 'plutoCapacity'];
                const boolFields = ['isReusable'];
                
                if (floatFields.includes(key)) {
                     const f = parseFloat(newValue);
                     if (!isNaN(f)) updateData[key] = f;
                } else if (boolFields.includes(key)) {
                     updateData[key] = (String(newValue).toLowerCase() === 'true');
                } else {
                     updateData[key] = newValue;
                }
            }
        }

        if (Object.keys(updateData).length > 0) {
            console.log(`Updating Rocket [${row.name}]:`, updateData);
            await prisma.rocket.update({
                where: { name: row.name },
                data: updateData
            });
            count++;
        }
    }
    console.log(`Updated ${count} rockets.`);
}

async function updateEngines() {
    console.log('Processing Engines FY...');
    const workbook = XLSX.readFile(path.join(__dirname, '../doc/engine_database_fy.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let count = 0;
    for (const row of data) {
        if (!row.name) continue;
        
        const updateData = {};
        
        for (const key of Object.keys(row)) {
            if (key === 'id' || key === 'imageUrl' || key === 'createdAt' || key === 'updatedAt') continue;
            
            const cellValue = row[key];
            const newValue = parseValue(cellValue);
            
            if (newValue !== undefined) {
                 updateData[key] = newValue;
            }
        }

        if (Object.keys(updateData).length > 0) {
            console.log(`Updating Engine [${row.name}]:`, updateData);
            await prisma.engine.update({
                where: { name: row.name },
                data: updateData
            });
            count++;
        }
    }
    console.log(`Updated ${count} engines.`);
}

async function main() {
    await updateRockets();
    await updateEngines();
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
