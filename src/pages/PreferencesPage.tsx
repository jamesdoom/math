import { Link } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
export function PreferencesPage() {
  const { preferences, updatePreferences, storageError } = usePreferences();
  return <div className="start-page">
    <section className="start-card">
      <span className="eyebrow">MAKE IT COMFORTABLE</span>
      <h1>Display & help</h1>
      <p>Choose what feels comfortable. You can change these anytime.</p>
      <fieldset className="preference-group">
        <legend>Appearance</legend>
        {(['dark', 'light'] as const).map(theme => <label key={theme}>
          <input type="radio" name="theme" value={theme} checked={preferences.theme === theme} onChange={() => updatePreferences({ theme })} />
          {theme === 'dark' ? 'Dark' : 'Light'}
        </label>)}
      </fieldset>
      <fieldset className="preference-group">
        <legend>Movement</legend>
        <label><input type="checkbox" checked={preferences.reducedMotion} onChange={e => updatePreferences({ reducedMotion: e.target.checked })} />Reduce motion</label>
        <p className="fine-print">On by default. Your device’s reduced-motion setting is also respected. No sound plays in the app.</p>
      </fieldset>
      <fieldset className="preference-group">
        <legend>Explanation detail</legend>
        <label><input type="radio" name="explanations" checked={preferences.explanations === 'always'} onChange={() => updatePreferences({ explanations: 'always' })} />Show explanations right away</label>
        <label><input type="radio" name="explanations" checked={preferences.explanations === 'on-request'} onChange={() => updatePreferences({ explanations: 'on-request' })} />Let me open extra explanations</label>
        <p className="fine-print">The problem, useful facts, and feedback on mistakes stay visible. Clues are always available.</p>
      </fieldset>
      <p role="status">{storageError ? 'Your settings work now, but this browser could not save them for next time.' : 'Settings are saved on this browser when you change them.'}</p>
      <Link className="primary" to="/">Back to home</Link>
    </section>
  </div>;
}
