import { useEffect, useState } from 'react';

/**
 * Retourne true quand un champ de saisie a le focus (clavier mobile ouvert).
 * Utilisé pour masquer les CTA flottants pendant la saisie.
 */
export function useInputFocused() {
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const isField = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    };
    const onFocus = (e: FocusEvent) => { if (isField(e.target)) setFocused(true); };
    const onBlur = (e: FocusEvent) => { if (isField(e.target)) setFocused(false); };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    return () => {
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onBlur);
    };
  }, []);
  return focused;
}
