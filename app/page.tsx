import { supabase } from '@/lib/supabase';
import { KanbanBoard } from '@/components/kanban-board';
import { LeadForm } from '@/components/lead-form';

export default async function Page() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Error cargando leads: {error.message}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CRM de Leads</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gestión de clientes potenciales y oportunidades.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <KanbanBoard initialLeads={leads ?? []} />
        </section>

        <aside className="space-y-6">
          <LeadForm />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Aquí luego puedes mostrar alertas de seguimiento pendiente.
          </div>
        </aside>
      </div>
    </main>
  );
}
