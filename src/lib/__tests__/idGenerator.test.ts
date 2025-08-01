/**
 * Tests for ID generator utility functions
 */

import { 
  generateUniqueTransactionId, 
  generateSimpleTransactionId, 
  generateGuaranteedUniqueTransactionId,
  resetIdTracking 
} from '../idGenerator';

describe('ID Generator Tests', () => {
  beforeEach(() => {
    resetIdTracking();
  });

  describe('generateUniqueTransactionId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const id = generateUniqueTransactionId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(iterations);
    });

    it('should follow the correct format', () => {
      const id = generateUniqueTransactionId();
      expect(id).toMatch(/^TXN-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/);
    });
  });

  describe('generateSimpleTransactionId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const id = generateSimpleTransactionId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(iterations);
    });

    it('should follow the correct format', () => {
      const id = generateSimpleTransactionId();
      expect(id).toMatch(/^TXN\d{12}$/);
    });
  });

  describe('generateGuaranteedUniqueTransactionId', () => {
    it('should generate unique IDs even with rapid generation', () => {
      const ids = new Set<string>();
      const iterations = 2000;

      for (let i = 0; i < iterations; i++) {
        const id = generateGuaranteedUniqueTransactionId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(iterations);
    });

    it('should handle collision detection', () => {
      const ids = new Set<string>();
      const iterations = 5000; // Large number to test collision handling

      for (let i = 0; i < iterations; i++) {
        const id = generateGuaranteedUniqueTransactionId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }

      expect(ids.size).toBe(iterations);
    });
  });

  describe('Performance Tests', () => {
    it('should generate IDs quickly', () => {
      const startTime = performance.now();
      const iterations = 10000;

      for (let i = 0; i < iterations; i++) {
        generateGuaranteedUniqueTransactionId();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should generate 10k IDs in less than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Memory Management', () => {
    it('should clean up old IDs to prevent memory leaks', () => {
      // Generate more than 10000 IDs to trigger cleanup
      for (let i = 0; i < 12000; i++) {
        generateGuaranteedUniqueTransactionId();
      }

      // Should still work after cleanup
      const id = generateGuaranteedUniqueTransactionId();
      expect(id).toMatch(/^TXN-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/);
    });
  });
});
