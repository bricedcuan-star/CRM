'use client';

import { useMemo, useState } from 'react';

type LeadStatus = 'nuevo' | 'contactado' | 'diagnostico' | 'propuesta' | 'cerrado';

type Lead = {
  id: string;
  nombre: string;
  empresa: string | null;
  estado: LeadStatus;
  nivel_interes: number;
  valor_estimado: number;
  fecha_ultima_interaccion: string | null;
  proximo_seguimiento: string | null;
};

const columns: { key: LeadStatus; title: string }[] = [
  { key: 'nuevo', title: 'Nuevo' },
  { key: 'contactado', title: 'Contactado' },
  { key: 'diagnostico', title: 'Diagnóstico' },
  { key: 'propuesta', title: 'Propuesta' },
  { key: 'cerrado', title: 'Cerrado' },
];

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);

  const grouped = useMemo(() => {
    return columns.reduce<Record<LeadStatus, Lead[]>>((acc, col) => {
      acc[col.key] = leads.filter((lead) => lead.estado === col.key);
      return acc;
    }, {} as Record<LeadStatus, Lead[]>);
  }, [leads]);

  async function updateLeadStatus(leadId: string, estado: LeadStatus) {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, estado } : lead)));

    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, estado }),
    });
  }

  return (
    <div className="grid gap-4 overflow-x-auto xl:grid-cols-5">
      {columns.map((column) => (
        <div key={column.key} className="min-w-[260px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
            <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
              {grouped[column.key].length}
            </span>
          </div>

          <div
            className="min-h-[120px] space-y-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const leadId = e.dataTransfer.getData('leadId');
              updateLeadStatus(leadId, column.key);
            }}
          >
            {grouped[column.key].map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{lead.nombre}</p>
                    <p className="text-xs text-slate-500">{lead.empresa ?? 'Sin empresa'}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                    {lead.nivel_interes}/5
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p>Valor: ${Number(lead.valor_estimado).toLocaleString('es-CO')}</p>
                  <p>Última interacción: {lead.fecha_ultima_interaccion ?? 'Pendiente'}</p>
                  <p>Seguimiento: {lead.proximo_seguimiento ?? 'Sin fecha'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
