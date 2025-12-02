'use client';
import { normalize } from '@repo/services/index';

import './page.scss';

export default function Home() {
  const name = 'João';

  return (
    <div className="page">
      <main className="page__main">
        <h1>name: {name}</h1>
        <h1>normalize: {normalize(name)}</h1>
      </main>
    </div>
  );
}
