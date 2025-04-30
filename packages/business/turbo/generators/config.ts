import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('business', {
    description: 'add a new business',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the business ?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'file name cannot include an extension';
          }
          if (input.match(' ')) {
            return 'file name cannot include spaces';
          }
          if (!input) {
            return 'file name is required';
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/{{ kebabCase name }}.ts',
        templateFile: 'templates/business.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/{{ kebabCase name }}.spec.ts',
        templateFile: 'templates/spec.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/index.ts',
        template: 'export * from \'./{{kebabCase name}}\';',
      },
      {
        type: 'append',
        path: 'src/{{ type }}/index.ts',
        template: 'export * from \'./{{kebabCase name}}\';',
      },
    ],
  });

  plop.setGenerator('business-module-nest', {
    description: 'add a new business module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the business module?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'file name cannot include an extension';
          }
          if (input.match(' ')) {
            return 'file name cannot include spaces';
          }
          if (!input) {
            return 'file name is required';
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/api/nest/{{ kebabCase name }}/types.ts',
        templateFile: 'templates/modules/nest/types.hbs',
      },
      {
        type: 'add',
        path: 'src/api/nest/{{ kebabCase name }}/{{ kebabCase name }}.ts',
        templateFile: 'templates/modules/nest/nest.hbs',
      },
      {
        type: 'add',
        path: 'src/api/nest/{{ kebabCase name }}/{{ kebabCase name }}.spec.ts',
        templateFile: 'templates/modules/nest/nest.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/api/nest/{{ kebabCase name }}/index.ts',
        template: 'export { {{pascalCase name}} } from \'./{{ kebabCase name }}\';',
      },
      {
        type: 'append',
        path: 'src/api/nest/index.ts',
        template: 'export * from \'./{{kebabCase name}}\';',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/types.ts',
        templateFile: 'templates/modules/types.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/{{ kebabCase name }}.ts',
        templateFile: 'templates/modules/entity.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/{{ kebabCase name }}.spec.ts',
        templateFile: 'templates/spec.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/business/business.ts',
        templateFile: 'templates/modules/business.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/business/business.spec.ts',
        templateFile: 'templates/modules/business.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/business/index.ts',
        template: 'export { default as {{pascalCase name}}Business} from \'./business\';',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/service/service.ts',
        templateFile: 'templates/modules/service.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/service/service.spec.ts',
        templateFile: 'templates/modules/service.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/service/index.ts',
        template: 'export { {{pascalCase name}}Service} from \'./service\';',
      },
      {
        type: 'add',
        path: 'src/{{ kebabCase name }}/index.ts',
        templateFile: 'templates/modules/index.hbs',
      },
      {
        type: 'append',
        path: 'src/index.ts',
        template: 'export * from \'./{{kebabCase name}}\';',
      },
    ],
  });
}
