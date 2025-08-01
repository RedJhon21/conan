/**
 * Simple test script to verify unique ID generation
 * Run this to test that duplicate IDs are no longer generated
 */

import { 
  generateUniqueTransactionId, 
  generateSimpleTransactionId, 
  generateGuaranteedUniqueTransactionId,
  resetIdTracking 
} from './idGenerator';

// Test function to check for duplicates
function testUniqueIdGeneration() {
  console.log('🧪 Testing Unique ID Generation...\n');

  // Reset tracking before tests
  resetIdTracking();

  // Test 1: generateUniqueTransactionId
  console.log('1️⃣ Testing generateUniqueTransactionId:');
  const uniqueIds = new Set<string>();
  const iterations = 1000;

  for (let i = 0; i < iterations; i++) {
    const id = generateUniqueTransactionId();
    if (uniqueIds.has(id)) {
      console.log(`❌ DUPLICATE FOUND: ${id}`);
      return false;
    }
    uniqueIds.add(id);
  }
  console.log(`✅ Generated ${iterations} unique IDs`);
  console.log(`📝 Sample IDs: ${Array.from(uniqueIds).slice(0, 5).join(', ')}\n`);

  // Test 2: generateSimpleTransactionId
  console.log('2️⃣ Testing generateSimpleTransactionId:');
  const simpleIds = new Set<string>();

  for (let i = 0; i < iterations; i++) {
    const id = generateSimpleTransactionId();
    if (simpleIds.has(id)) {
      console.log(`❌ DUPLICATE FOUND: ${id}`);
      return false;
    }
    simpleIds.add(id);
  }
  console.log(`✅ Generated ${iterations} unique simple IDs`);
  console.log(`📝 Sample IDs: ${Array.from(simpleIds).slice(0, 5).join(', ')}\n`);

  // Test 3: generateGuaranteedUniqueTransactionId
  console.log('3️⃣ Testing generateGuaranteedUniqueTransactionId:');
  const guaranteedIds = new Set<string>();

  for (let i = 0; i < iterations; i++) {
    const id = generateGuaranteedUniqueTransactionId();
    if (guaranteedIds.has(id)) {
      console.log(`❌ DUPLICATE FOUND: ${id}`);
      return false;
    }
    guaranteedIds.add(id);
  }
  console.log(`✅ Generated ${iterations} guaranteed unique IDs`);
  console.log(`📝 Sample IDs: ${Array.from(guaranteedIds).slice(0, 5).join(', ')}\n`);

  // Test 4: Performance test
  console.log('4️⃣ Testing Performance:');
  const startTime = performance.now();
  for (let i = 0; i < 10000; i++) {
    generateGuaranteedUniqueTransactionId();
  }
  const endTime = performance.now();
  console.log(`✅ Generated 10,000 IDs in ${(endTime - startTime).toFixed(2)}ms\n`);

  // Test 5: Rapid generation test (simulate real-time scenario)
  console.log('5️⃣ Testing Rapid Generation (Real-time simulation):');
  const rapidIds = new Set<string>();
  const rapidIterations = 2000;

  for (let i = 0; i < rapidIterations; i++) {
    const id = generateGuaranteedUniqueTransactionId();
    if (rapidIds.has(id)) {
      console.log(`❌ DUPLICATE FOUND in rapid generation: ${id}`);
      return false;
    }
    rapidIds.add(id);
  }
  console.log(`✅ Generated ${rapidIterations} unique IDs in rapid succession\n`);

  console.log('🎉 ALL TESTS PASSED! No duplicate IDs found.');
  return true;
}

// Test the old problematic method for comparison
function testOldMethod() {
  console.log('\n🔍 Testing Old Method (for comparison):');
  const oldIds = new Set<string>();
  let duplicates = 0;

  for (let i = 0; i < 1000; i++) {
    // This is the old problematic method
    const id = `TXN${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    if (oldIds.has(id)) {
      duplicates++;
    }
    oldIds.add(id);
  }

  console.log(`📊 Old method generated ${duplicates} duplicates out of 1000 attempts`);
  console.log(`📈 Duplicate rate: ${(duplicates / 1000 * 100).toFixed(2)}%`);
}

// Export for use in other files
export { testUniqueIdGeneration, testOldMethod };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  testUniqueIdGeneration();
  testOldMethod();
}
