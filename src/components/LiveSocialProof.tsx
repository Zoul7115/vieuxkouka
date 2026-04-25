import { useEffect, useState } from 'react';

const NAMES_BF = ['Awa de Bobo', 'Ibrahim de Ouaga', 'Salif de Koudougou', 'Fatim de Banfora', 'Moussa de Kaya', 'Aminata de Tenkodogo', 'Issouf de Fada', 'Rasmata de Pô', 'Boukary de Dori', 'Karim de Ouahigouya'];
const NAMES_OTHER = ['Kofi de Cotonou', 'Aïcha de Lomé', 'Mamadou de Bamako', 'Ousmane de Dakar', 'Adjoa d\'Abidjan'];

export function LiveSocialProof({ product = 'Poudre KOUKA' }: { product?: string }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [mins, setMins] = useState(3);

  useEffect(() => {
    const all = [...NAMES_BF, ...NAMES_BF, ...NAMES_OTHER]; // pondéré BF
    let timer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setName(all[Math.floor(Math.random() * all.length)]);
      setMins(Math.floor(Math.random() * 14) + 1);
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
        timer = setTimeout(cycle, 12000 + Math.random() * 8000);
      }, 6000);
    };

    const start = setTimeout(cycle, 8000);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, []);

  if (!show || !name) return null;

  return (
    <div className="fixed bottom-20 left-3 z-40 max-w-[280px] bg-white border-2 border-vert-mid rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] p-3 flex items-start gap-2.5 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse mt-1.5 shrink-0" />
      <div className="text-xs leading-snug">
        <div className="font-extrabold text-foreground">{name}</div>
        <div className="text-muted-foreground">vient de commander <strong className="text-vert">{product}</strong></div>
        <div className="text-[10px] text-muted-foreground mt-0.5">il y a {mins} min</div>
      </div>
    </div>
  );
}
