'use client';

import { useState } from 'react';

export function LeadForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    e.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Nuevo lead</h2>

      <div className="space-y-3">
        <input name="nombre" placeholder="Nombre" required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500" />
        <input name="empresa" placeholder="Empresa" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500" />

        <select name="nivel_interes" defaultValue="3" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500">
          <option value="1">1 - Bajo</option>
          <option value="2">2</option>
          <option value="3">3 - Medio</option>
          <option value="4">4</option>
          <option value="5">5 - Alto</option>
        </select>

        <input
          name="valor_estimado"
          type="number"
          placeholder="Valor estimado"
          min="0"
          step="0.01"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar lead'}
        </button>
      </div>
    </form>
  );
}
