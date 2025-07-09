import { describe, expect, it } from '@jest/globals';

import { ERole } from '@repo/business/enum';

import { AuthRoles } from './auth-roles.decorator';


describe('AuthRoles Decorator', () => {
    it('should set metadata with the correct roles', () => {
        // Cria uma função de teste para decorar
        class TestClass {
            @AuthRoles(ERole.ADMIN)
            testMethod() {
            }
        }

        // Obtém a metadata definida pelo decorator
        const roles = Reflect.getMetadata('role', TestClass.prototype.testMethod);

        // Verifica se a metadata foi definida corretamente
        expect(roles).toBeDefined();
        expect(Array.isArray(roles)).toBeTruthy();
        expect(roles).toContain(ERole.ADMIN);
    });

    it('should handle multiple roles', () => {
        class TestClass {
            @AuthRoles(ERole.ADMIN, ERole.USER)
            testMethod() {
            }
        }

        const roles = Reflect.getMetadata('role', TestClass.prototype.testMethod);

        expect(roles).toHaveLength(2);
        expect(roles).toContain(ERole.ADMIN);
        expect(roles).toContain(ERole.USER);
    });

    it('should handle empty roles array', () => {
        class TestClass {
            @AuthRoles()
            testMethod() {
            }
        }

        const roles = Reflect.getMetadata('role', TestClass.prototype.testMethod);

        expect(roles).toBeDefined();
        expect(Array.isArray(roles)).toBeTruthy();
        expect(roles).toHaveLength(0);
    });
});
