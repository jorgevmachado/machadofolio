import React, { useState } from 'react';
import Autocomplete from './Autocomplete';
import type { OptionsProps } from '../../../../../utils';

const options: OptionsProps[] = [
  { value: 'br', label: 'Brasil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colômbia' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'fr', label: 'França' },
  { value: 'de', label: 'Alemanha' },
  { value: 'jp', label: 'Japão' },
];

export default {
  title: 'DS/Fields/Autocomplete',
  component: Autocomplete,
};

export const Default = () => (
  <Autocomplete id="autocomplete-default" options={options} placeholder="Selecione um país..." />
);

export const Controlled = () => {
  const [value, setValue] = useState('');
  return (
    <Autocomplete
      id="autocomplete-controlled"
      options={options}
      value={value}
      onInput={(_, v) => setValue(v || '')}
      placeholder="Controlado externamente"
    />
  );
};

export const CustomFilter = () => (
  <Autocomplete
    id="autocomplete-custom-filter"
    options={options}
    placeholder="Filtro customizado: começa com..."
    filterFunction={(input, opt) => opt.label.toLowerCase().startsWith(input.toLowerCase())}
  />
);

export const Disabled = () => (
  <Autocomplete id="autocomplete-disabled" options={options} disabled placeholder="Desabilitado" />
);

export const WithForm = () => {
  const [form, setForm] = useState({ country: '' });
  return (
    <form onSubmit={e => { e.preventDefault(); alert(JSON.stringify(form)); }}>
      <Autocomplete
        id="autocomplete-form"
        name="country"
        options={options}
        value={form.country}
        onInput={(_, v) => setForm(f => ({ ...f, country: v || '' }))}
        placeholder="Autocomplete em formulário"
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

