import { describe, expect, it } from '@jest/globals';

import { validate } from 'class-validator';

import { IsNameDependingOnParent } from './name-depending-parent.decorator';

class TestDto {
    @IsNameDependingOnParent()
    name?: string;

    parent?: string;
}

describe('IsNameDependingOnParent', () => {
    it('Deve ser válido quando ambos parent e name não estão presentes', async () => {
        const dto = new TestDto();
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('Deve ser válido quando parent está presente e name está preenchido', async () => {
        const dto = new TestDto();
        dto.parent = 'algum-parent';
        dto.name = 'Nome Obrigatório';
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('Deve ser inválido quando parent está presente e name está ausente', async () => {
        const dto = new TestDto();
        dto.parent = 'algum-parent';
        dto.name = undefined;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0]?.constraints).toHaveProperty('isNameDependingOnParent');
        expect(Object.values(errors[0]?.constraints!)).toContain(
            'The name field is mandatory when parent is present!'
        );
    });

    it('Deve ser inválido quando parent está ausente e name está preenchido', async () => {
        const dto = new TestDto();
        dto.name = 'Nome Preenchido Indevidamente';
        dto.parent = undefined;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0]?.constraints).toHaveProperty('isNameDependingOnParent');
        expect(Object.values(errors[0]?.constraints!)).toContain(
            'The name field cannot be filled when parent is absent!'
        );
    });

    it('Deve ser válido quando ambos parent e name estão ausentes', async () => {
        const dto = new TestDto();
        dto.parent = undefined;
        dto.name = undefined;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('Deve ser válido quando parent é string vazia e name ausente', async () => {
        const dto = new TestDto();
        dto.parent = '';
        dto.name = undefined;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('Deve ser inválido quando parent é string vazia e name está preenchido', async () => {
        const dto = new TestDto();
        dto.parent = '';
        dto.name = 'Nome Indevido';
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(Object.values(errors[0]?.constraints!)).toContain(
            'The name field cannot be filled when parent is absent!'
        );
    });
});