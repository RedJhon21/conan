/**
 * Utility functions for generating unique IDs
 */

// Counter to ensure uniqueness even with same timestamp
let counter = 0;

/**
 * Generates a unique transaction ID using timestamp + counter + random component
 * Format: TXN-{timestamp}-{counter}-{random}
 */
export const generateUniqueTransactionId = (): string => {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const currentCounter = (++counter).toString(36).padStart(2, '0'); // Increment counter
  const random = Math.random().toString(36).substring(2, 5); // Short random component
  
  return `TXN-${timestamp}-${currentCounter}-${random}`.toUpperCase();
};

/**
 * Generates a simple unique transaction ID for backwards compatibility
 * Format: TXN{timestamp}{counter}{random}
 */
export const generateSimpleTransactionId = (): string => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const currentCounter = (++counter).toString().padStart(3, '0'); // 3-digit counter
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random
  
  return `TXN${timestamp}${currentCounter}${random}`;
};

/**
 * Generates a UUID-like unique ID for general purposes
 */
export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const counterPart = (++counter).toString(36);
  
  return `${timestamp}-${randomPart}-${counterPart}`;
};

/**
 * Set to track generated IDs to ensure uniqueness (for development/testing)
 */
const generatedIds = new Set<string>();

/**
 * Generates a guaranteed unique transaction ID with collision detection
 */
export const generateGuaranteedUniqueTransactionId = (): string => {
  let id: string;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    id = generateUniqueTransactionId();
    attempts++;
    
    if (attempts > maxAttempts) {
      // Fallback to timestamp-based ID if too many collisions
      id = `TXN-${Date.now()}-${++counter}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
      break;
    }
  } while (generatedIds.has(id));
  
  generatedIds.add(id);
  
  // Clean up old IDs to prevent memory leaks (keep last 10000)
  if (generatedIds.size > 10000) {
    const idsArray = Array.from(generatedIds);
    generatedIds.clear();
    idsArray.slice(-5000).forEach(id => generatedIds.add(id));
  }
  
  return id;
};

/**
 * Reset the ID tracking (useful for testing)
 */
export const resetIdTracking = (): void => {
  generatedIds.clear();
  counter = 0;
};
