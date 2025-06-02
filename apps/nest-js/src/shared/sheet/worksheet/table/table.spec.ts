import type { TableConfig, TableParamsConstructor } from './types';
import { Table } from './table';

describe('Table', () => {
    const defaultTableConfig: TableConfig = {
        width: 4,
        fontSize: 12,
        rowHeight: 14,
        initialRow: 13,
        tablesPerRow: 3,
    };

    const mockTableStyle = {
        title: { font: { sz: 12 } },
        header: {
            font: { sz: 12 },
            borderStyle: 'thin'
        },
        body: {
            font: { sz: 12 },
            borderStyle: 'thin'
        }
    };

    const createTableParams = (overrides?: Partial<TableParamsConstructor>): TableParamsConstructor => ({
        body: [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 }
        ],
        index: 0,
        title: 'Test Table',
        config: defaultTableConfig,
        headers: ['name', 'age'],
        tableStyle: mockTableStyle,
        currentRow: 0,
        ...overrides
    });

    describe('constructor', () => {
        it('deve criar uma tabela com configurações padrão', () => {
            const table = new Table(createTableParams());

            expect(table.title).toBeDefined();
            expect(table.header).toHaveLength(2);
            expect(table.body).toHaveLength(4);
            expect(table.nextPositionRow).toEqual(0);
        });

        it('deve criar uma tabela sem título', () => {
            const table = new Table(createTableParams({ title: undefined }));

            expect(table.title.value).toBe('title');
        });

        it('deve criar uma tabela sem headers', () => {
            const table = new Table(createTableParams({ headers: [] }));

            expect(table.header).toHaveLength(0);
            expect(table.body).toHaveLength(0);
        });
    });

    describe('título da tabela', () => {
        it('deve criar configuração correta para o título', () => {
            const table = new Table(createTableParams());

            expect(table.title).toEqual({
                value: 'Test Table',
                style: mockTableStyle.title,
                position: { row: 0, column: 1 },
                mergePosition: {
                    startRow: 0,
                    startColumn: 1,
                    endRow: 0,
                    endColumn: 3
                }
            });
        });
    });

    describe('cabeçalho da tabela', () => {
        it('deve criar configurações corretas para o cabeçalho', () => {
            const table = new Table(createTableParams());

            expect(table.header).toEqual([
                {
                    value: 'name',
                    style: mockTableStyle.header,
                    position: { row: 1, column: 1 }
                },
                {
                    value: 'age',
                    style: mockTableStyle.header,
                    position: { row: 1, column: 2 }
                }
            ]);
        });
    });

    describe('corpo da tabela', () => {
        it('deve criar configurações corretas para o corpo', () => {
            const table = new Table(createTableParams({ headers: ['name', 'age', 'date'], }));

            const expectedBody = [
                {
                    value: 'John',
                    style: mockTableStyle.body,
                    position: { row: 2, column: 1 }
                },
                {
                    value: '30',
                    style: mockTableStyle.body,
                    position: { row: 2, column: 2 }
                },
                {
                    value: '',
                    style: mockTableStyle.body,
                    position: { row: 2, column: 3 }
                },
                {
                    value: 'Jane',
                    style: mockTableStyle.body,
                    position: { row: 3, column: 1 }
                },
                {
                    value: '25',
                    style: mockTableStyle.body,
                    position: { row: 3, column: 2 }
                },
                {
                    value: '',
                    style: mockTableStyle.body,
                    position: { row: 3, column: 3 }
                },
            ];

            expect(table.body).toEqual(expectedBody);
        });

        it('deve tratar valores booleanos corretamente', () => {
            const tableParams = createTableParams({
                headers: ['active'],
                body: [{ active: true }, { active: false }]
            });

            const table = new Table(tableParams);

            expect(table.body[0]?.value).toBe('YES');
            expect(table.body[1]?.value).toBe('NO');
        });

        it('deve tratar valores numéricos corretamente', () => {
            const tableParams = createTableParams({
                headers: ['value'],
                body: [{ value: 0 }, { value: 42 }]
            });

            const table = new Table(tableParams);

            expect(table.body[0]?.value).toBe('0');
            expect(table.body[1]?.value).toBe('42');
        });

        it('deve tratar valores nulos ou undefined corretamente', () => {
            const tableParams = createTableParams({
                headers: ['value'],
                body: []
            });

            const table = new Table(tableParams);

            expect(table.body[0]?.value).toBeUndefined();
            expect(table.body[1]?.value).toBeUndefined();
        });
    });

    describe('cálculo de dimensões', () => {
        it('deve calcular posição correta para primeira tabela', () => {
            const table = new Table(createTableParams({ index: 0 }));

            expect(table.title.position).toEqual({ row: 0, column: 1 });
            expect(table.nextPositionRow).toEqual(0);
        });

        it('deve calcular posição correta para segunda tabela na mesma linha', () => {
            const table = new Table(createTableParams({ index: 1 }));

            expect(table.title.position).toEqual({ row: 0, column: 5 });
        });

        it('deve calcular posição correta para tabela na próxima linha', () => {
            const table = new Table(createTableParams({ index: 2 }));

            expect(table.title.position).toEqual({ row: 0, column: 9 });
        });

        it('deve calcular nextPositionRow corretamente', () => {
            const table = new Table(createTableParams({ index: 0 }));

            expect(table.nextPositionRow).toBe(0);
        });

        it('deve calcular nextPositionRow corretamente para última tabela na linha', () => {
            const table = new Table(createTableParams({ index: 2 }));

            expect(table.nextPositionRow).toBe(14);
        });
    });
});