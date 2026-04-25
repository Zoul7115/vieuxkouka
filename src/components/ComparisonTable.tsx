type Row = { label: string; kouka: string; meds: string; surgery: string };

export function ComparisonTable({
  rows,
  productLabel = 'KOUKA',
  medsLabel = 'Médicaments',
  surgeryLabel = 'Opération',
}: {
  rows: Row[];
  productLabel?: string;
  medsLabel?: string;
  surgeryLabel?: string;
}) {
  return (
    <div className="bloc overflow-x-auto p-0">
      <table className="w-full text-sm border-collapse min-w-[520px]">
        <thead>
          <tr className="bg-vert text-white">
            <th className="text-left px-3 py-3 font-bold">Critère</th>
            <th className="px-3 py-3 font-extrabold bg-vert-mid">{productLabel}</th>
            <th className="px-3 py-3 font-bold">{medsLabel}</th>
            <th className="px-3 py-3 font-bold">{surgeryLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-vert-bg/40'}>
              <td className="px-3 py-3 font-bold text-foreground">{r.label}</td>
              <td className="px-3 py-3 text-center font-bold text-vert bg-vert-bg/60">{r.kouka}</td>
              <td className="px-3 py-3 text-center text-muted-foreground">{r.meds}</td>
              <td className="px-3 py-3 text-center text-muted-foreground">{r.surgery}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
