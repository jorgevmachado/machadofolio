
import generateComponentId from './generateComponentId';


describe('generateComponentId', () => {
    it('should return a string that starts with the input text', () => {
        const id = generateComponentId('myComponent');
        expect(id.startsWith('myComponent-')).toBe(true);
    });

    it('should include a dash, a random number, and a uuid', () => {
        const id = generateComponentId('example');
        const parts = id.split('-');
        expect(parts.length).toBeGreaterThan(2);
        expect(parts[0]).toBe('example');
        expect(/^\d\.\d$/.test(parts[1]!)).toBe(true);
        expect(parts.slice(2).join('-')).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i);
    });

    it('should generate different ids for subsequent calls with the same text', () => {
        const first = generateComponentId('test');
        const second = generateComponentId('test');
        expect(first).not.toBe(second);
    });

    it('should work with empty string as text', () => {
        const id = generateComponentId('');
        expect(id.startsWith('-')).toBe(true);
        const parts = id.split('-');
        expect(parts.length).toBeGreaterThan(2);
        expect(/^\d\.\d$/.test(parts[1]!)).toBe(true);
        expect(parts.slice(2).join('-')).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i);
    });


    it('should always contain three sections when split by "-" for the prefix and number', () => {
        const id = generateComponentId('prefix');
        const parts = id.split('-');
        expect(parts[0]).toBe('prefix');
        expect(/^\d\.\d$/.test(parts[1]!)).toBe(true);
    });
});