const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

async function exportToCsv() {
  try {
    // 1. Export Rockets
    console.log('Fetching rockets...');
    const rockets = await prisma.rocket.findMany();
    
    if (rockets.length > 0) {
      // Use XLSX utility to convert JSON to worksheet then to CSV
      const wsRockets = XLSX.utils.json_to_sheet(rockets);
      const csvRockets = XLSX.utils.sheet_to_csv(wsRockets);
      
      const rocketPath = path.join(__dirname, '../doc/rocket_database_export.csv');
      fs.writeFileSync(rocketPath, csvRockets);
      console.log(`Successfully exported ${rockets.length} rockets to ${rocketPath}`);
    } else {
      console.log('No rockets found to export.');
    }

    // 2. Export Engines
    console.log('Fetching engines...');
    const engines = await prisma.engine.findMany();

    if (engines.length > 0) {
      const wsEngines = XLSX.utils.json_to_sheet(engines);
      const csvEngines = XLSX.utils.sheet_to_csv(wsEngines);
      
      const enginePath = path.join(__dirname, '../doc/engine_database_export.csv');
      fs.writeFileSync(enginePath, csvEngines);
      console.log(`Successfully exported ${engines.length} engines to ${enginePath}`);
    } else {
      console.log('No engines found to export.');
    }

  } catch (error) {
    console.error('Error exporting to CSV:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToCsv();
