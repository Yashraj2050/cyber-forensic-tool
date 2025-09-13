#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load sample data script
async function loadSampleData() {
  console.log('🚀 Loading sample data for Cyber Forensic Tool...');
  
  try {
    // Check if the application is running
    const response = await fetch('http://localhost:3000/api/sample-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Sample data loaded successfully!');
      console.log('📊 Summary:');
      console.log(`   - Entities: ${result.entities}`);
      console.log(`   - Posts: ${result.posts}`);
      console.log(`   - Wallets: ${result.wallets}`);
      console.log(`   - Transactions: ${result.transactions}`);
      console.log('\n🎯 You can now access the application at http://localhost:3000');
      console.log('🔍 The dashboard is ready with demo data!');
    } else {
      console.error('❌ Failed to load sample data. Make sure the server is running on port 3000.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error loading sample data:', error.message);
    console.log('💡 Make sure the development server is running: npm run dev');
    process.exit(1);
  }
}

// Run the script
loadSampleData();