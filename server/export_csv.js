const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function exportToCSV() {
  console.log('Starting CSV Export...');

  const exportTable = async (modelName, fileName) => {
    const data = await prisma[modelName].findMany();
    if (data.length === 0) {
      console.log(`No data found for ${modelName}`);
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add Headers
    csvRows.push(headers.join(','));

    // Add Data
    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) return '';
        
        // Escape quotes and wrap in quotes if contains comma/newline
        // Using new RegExp to avoid syntax errors in tool call
        const escaped = String(val).replace(new RegExp('"', 'g'), '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const outputPath = path.join(__dirname, '../doc', fileName);
    fs.writeFileSync(outputPath, '\ufeff' + csvRows.join('\n'), 'utf-8'); // Add BOM for Excel Chinese support
    console.log(`Successfully exported ${modelName} to ${outputPath}`);
  };

  try {
    await exportTable('rocket', 'rocket_database.csv');
    await exportTable('engine', 'engine_database.csv');
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToCSV();
