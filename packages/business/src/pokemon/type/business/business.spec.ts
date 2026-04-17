import PokemonTypeBusiness from './business';
import type { PokemonByNameResponse } from '../../poke-api';
import * as services from '@repo/services';

jest.mock('@repo/services');

jest.mock('../type', () => {
    function PokemonTypeMock(props: any) {
        return {
            name: props.name,
            order: props.order,
            url: props.url,
            text_color: props.text_color,
            background_color: props.background_color,
        };
    }
    return {
        __esModule: true,
        default: PokemonTypeMock,
        PokemonType: PokemonTypeMock,
    };
});

describe('PokemonTypeBusiness', () => {
    let business: PokemonTypeBusiness;

    beforeEach(() => {
        jest.spyOn(services, 'extractLastNumberFromUrl').mockReturnValue(42);
        business = new PokemonTypeBusiness();
    });

    describe('convertPokemonTypes', () => {
        it('deve converter uma lista de tipos corretamente', () => {
            const types = [
                {
                    type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
                },
                {
                    type: { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
                },
            ] as unknown as PokemonByNameResponse['types'];
            const result = business.convertPokemonTypes(types);
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('fire');
            expect(result[1].name).toBe('water');
            expect(result[0].order).toBe(42);
            expect(result[1].order).toBe(42);
        });

        it('deve retornar array vazio se types for undefined', () => {
            expect(business.convertPokemonTypes(undefined)).toEqual([]);
        });

        it('deve retornar array vazio se types for array vazio', () => {
            expect(business.convertPokemonTypes([])).toEqual([]);
        });
    });

    describe('ensureColor', () => {
        it('deve retornar as cores corretas para tipo conhecido', () => {
            const result = business.ensureColor({ name: 'fire' });
            expect(result).toEqual({ text_color: '#fff', background_color: '#ff2400' });
        });

        it('deve retornar cores padrão para tipo desconhecido', () => {
            const result = business.ensureColor({ name: 'unknown' });
            expect(result).toEqual({ text_color: '#FFF', background_color: '#000' });
        });

        it('deve priorizar text_color e background_color passados nos params', () => {
            const result = business.ensureColor({ name: 'fire', text_color: '#123', background_color: '#456' });
            expect(result).toEqual({ text_color: '#123', background_color: '#456' });
        });
    });
});
