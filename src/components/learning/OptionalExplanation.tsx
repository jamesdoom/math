import { usePreferences } from '../../context/PreferencesContext';
export function OptionalExplanation({ text, label = 'Why this works' }: { text: string; label?: string }) {
  const { preferences } = usePreferences();
  return <details className="optional-explanation" key={preferences.explanations} open={preferences.explanations === 'always'}>
    <summary>{label}</summary>
    <p>{text}</p>
  </details>;
}
