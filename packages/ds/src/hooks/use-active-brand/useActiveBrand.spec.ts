
import useActiveBrand from './useActiveBrand';

describe('useActiveBrand', () => {
    const setBrandName = (value: string) => {
        document.documentElement.style.setProperty('--brand-name', value);
    };

    afterEach(() => {
        document.documentElement.style.removeProperty('--brand-name');
    });


    it('must return the brand value without quotes.', () => {
        setBrandName('finance');
        expect(useActiveBrand()).toBe('finance');
    });

    it('must remove single quotes from the value.', () => {
        setBrandName("'geek'");
        expect(useActiveBrand()).toBe('geek');
    });

    it('must remove double quotes from the value.', () => {
        setBrandName('"law"');
        expect(useActiveBrand()).toBe('law');
    });

    it('should remove extra spaces.', () => {
        setBrandName('  finance  ');
        expect(useActiveBrand()).toBe('finance');
    });

    it('should return empty string if not defined.', () => {
        expect(useActiveBrand()).toBe('');
    });
});