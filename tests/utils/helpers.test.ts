import { describe, it, expect } from 'bun:test';
import { generateId, generateUUID, slugify } from '../../src/utils/helpers';
import { validateEmail } from '../../src/utils/validation';

describe('Helper Functions', () => {
    describe('generateId', () => {
        it('should generate a unique string ID', () => {
            const id1 = generateId();
            const id2 = generateId();

            expect(id1).toBeString();
            expect(id2).toBeString();
            expect(id1).not.toBe(id2);
        });
    });

    describe('generateUUID', () => {
        it('should generate a valid UUID format', () => {
            const uuid = generateUUID();
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            expect(uuid).toMatch(uuidRegex);
        });
    });

    describe('validateEmail', () => {
        it('should validate correct email addresses', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(validateEmail('user+tag@example.org')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('@example.com')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('test@.com')).toBe(false);
        });
    });

    describe('slugify', () => {
        it('should convert text to URL-friendly slug', () => {
            expect(slugify('Hello World')).toBe('hello-world');
            expect(slugify('Special @#$ Characters!')).toBe(
                'special-characters'
            );
            expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
        });
    });
});
