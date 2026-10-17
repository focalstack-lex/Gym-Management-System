// Port of design/canvas/Member-Workout.dc.html. Set rows toggle done (kg and reps validated),
// Add set appends a row, Finish workout goes to the share screen. Time and rest timer are the
// canvas sample values.

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

interface SetRow {
  id: number;
  previous: string;
  kg: string;
  reps: string;
  placeholder: string;
  done: boolean;
}

// Bench press is 4 sets (3 done); incline and cable pushdown are 3 sets each, not started.
const INITIAL: SetRow[] = [
  { id: 1, previous: '60 x 10', kg: '60', reps: '10', placeholder: '10', done: true },
  { id: 2, previous: '70 x 8', kg: '70', reps: '8', placeholder: '8', done: true },
  { id: 3, previous: '75 x 6', kg: '75', reps: '6', placeholder: '6', done: true },
  { id: 4, previous: '75 x 6', kg: '75', reps: '', placeholder: '6', done: false },
];
const OTHER_SETS = 6;

const validKg = (value: string) => /^\d+(\.\d+)?$/.test(value.trim()) && Number(value) > 0;
const validReps = (value: string) => /^\d+$/.test(value.trim()) && Number(value) > 0;

export function Workout() {
  const [sets, setSets] = useState<SetRow[]>(INITIAL);
  const [invalid, setInvalid] = useState<{ id: number; field: 'kg' | 'reps' } | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const nextId = useRef(INITIAL.length + 1);

  const done = sets.filter((s) => s.done);
  const volume = done.reduce((sum, s) => sum + Number(s.kg) * Number(s.reps), 0);
  const planned = sets.length + OTHER_SETS;
  const doneCount = done.length;

  function edit(id: number, patch: Partial<SetRow>) {
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function toggle(row: SetRow) {
    if (row.done) {
      edit(row.id, { done: false });
      return;
    }
    if (!validKg(row.kg)) {
      setInvalid({ id: row.id, field: 'kg' });
      inputs.current[row.id + ':kg']?.focus();
      return;
    }
    if (!validReps(row.reps)) {
      setInvalid({ id: row.id, field: 'reps' });
      inputs.current[row.id + ':reps']?.focus();
      return;
    }
    setInvalid(null);
    edit(row.id, { done: true });
  }

  function addSet() {
    const last = sets[sets.length - 1];
    const reps = last ? last.reps || last.placeholder : '';
    setSets((prev) => [
      ...prev,
      { id: nextId.current++, previous: last ? last.kg + ' x ' + reps : '', kg: last ? last.kg : '', reps: '', placeholder: reps, done: false },
    ]);
  }

  const bar = (
    <div style={css("position: absolute; left: 0; right: 0; bottom: 0; padding: 12px 20px 28px; background: #0C0C0E; border-top: 1px solid rgba(255,255,255,0.06); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 12px")}>
      <button type="button" style={css("height: 52px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer")}>Add exercise</button>
      <Link to="/m/share" style={css("height: 52px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800")}>Finish workout</Link>
    </div>
  );

  return (
    <PhoneScreen padding="52px 20px 0" bars={bar} bottomInset={170}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <Link to="/m/today" aria-label="Back to today" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <div style={css("display: flex; flex-direction: column; align-items: center; gap: 3px")}>
          <h1 style={css("margin: 0; font-size: 17px; font-weight: 700")}>Push day</h1>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #FF6A00")}></span>Recording</span>
        </div>
        <button type="button" aria-label="Workout options" style={css("width: 44px; height: 44px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; background: #17171A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
      </header>

      <section aria-label="Session totals" style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px")}>
        <div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr))")}>
          <div style={css("display: flex; flex-direction: column; gap: 5px")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Time</span>
            <span style={css("font-size: 26px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>42:18</span>
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 5px; padding-left: 14px; border-left: 1px solid rgba(255,255,255,0.06)")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Volume</span>
            <span style={css("font-size: 26px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>{volume.toLocaleString('en-US')}<span style={css("font-size: 12px; font-weight: 600; color: #8E8E93")}> kg</span></span>
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 5px; padding-left: 14px; border-left: 1px solid rgba(255,255,255,0.06)")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Sets</span>
            <span style={css("font-size: 26px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>{doneCount}<span style={css("font-size: 14px; font-weight: 600; color: #8E8E93")}>/{planned}</span></span>
          </div>
        </div>
        <div role="img" aria-label={doneCount + ' of ' + planned + ' planned sets done'} style={css(`display: grid; grid-template-columns: repeat(${planned}, minmax(0, 1fr)); gap: 4px`)}>
          {Array.from({ length: planned }, (_, i) =>
            i === 4 || i === 7 ? (
              <span key={i} style={css(`height: 4px; border-radius: 1px; background: ${i < doneCount ? '#FFFFFF' : '#3F3F46'}; margin-right: 4px`)}></span>
            ) : (
              <span key={i} style={css(`height: 4px; border-radius: 1px; background: ${i < doneCount ? '#FFFFFF' : '#3F3F46'}`)}></span>
            ),
          )}
        </div>
      </section>

      <section aria-label="Bench press" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 10px")}>
        <div style={css("display: flex; align-items: center; gap: 12px")}>
          <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1")}>
            <h2 style={css("margin: 0; font-size: 18px; font-weight: 800")}>Bench press</h2>
            <span style={css("font-size: 12px; color: #8E8E93")}>Barbell, {doneCount} of {sets.length} sets</span>
          </div>
          <div style={css("display: flex; align-items: center; gap: 8px")}>
            <svg width="28" height="28" viewBox="0 0 28 28" role="img" aria-label="Rest timer, 1 minute 24 seconds left of 2 minutes" style={css("display: block; transform: rotate(-90deg)")}>
              <circle cx="14" cy="14" r="12" fill="none" stroke="#3F3F46" strokeWidth="2"></circle>
              <circle cx="14" cy="14" r="12" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="52.8 75.4"></circle>
            </svg>
            <span style={css("display: flex; flex-direction: column; gap: 1px")}><span style={css("font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums")}>1:24</span><span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Rest</span></span>
          </div>
        </div>

        <div style={css("display: grid; grid-template-columns: 34px minmax(0, 1fr) 64px 64px 44px; gap: 8px; align-items: center; padding: 0 2px; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
          <span>Set</span><span>Previous</span><span style={css("text-align: center")}>Kg</span><span style={css("text-align: center")}>Reps</span><span></span>
        </div>

        {sets.map((row, index) => {
          const n = index + 1;
          if (row.done) {
            return (
              <div key={row.id} style={css("display: grid; grid-template-columns: 34px minmax(0, 1fr) 64px 64px 44px; gap: 8px; align-items: center; height: 44px; padding: 0 2px; font-variant-numeric: tabular-nums")}>
                <span style={css("font-size: 15px; font-weight: 700; color: #8E8E93")}>{n}</span>
                <span style={css("font-size: 13px; color: #8E8E93")}>{row.previous}</span>
                <span style={css("text-align: center; font-size: 16px; font-weight: 700")}>{row.kg}</span>
                <span style={css("text-align: center; font-size: 16px; font-weight: 700")}>{row.reps}</span>
                <button type="button" aria-label={'Set ' + n + ' done'} aria-pressed="true" onClick={() => toggle(row)} style={css("width: 44px; height: 44px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer")}><span style={css("width: 28px; height: 28px; border-radius: 50%; background: #FFFFFF; color: #000000; display: flex; align-items: center; justify-content: center")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span></button>
              </div>
            );
          }
          return (
            <div key={row.id} style={css("display: grid; grid-template-columns: 34px minmax(0, 1fr) 64px 64px 44px; gap: 8px; align-items: center; min-height: 52px; padding: 4px 2px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); font-variant-numeric: tabular-nums")}>
              <span style={css("font-size: 15px; font-weight: 800; color: #FFFFFF; padding-left: 6px")}>{n}</span>
              <span style={css("font-size: 13px; color: #8E8E93")}>{row.previous}</span>
              <input ref={(el) => { inputs.current[row.id + ':kg'] = el; }} type="text" inputMode="decimal" aria-label={'Set ' + n + ' weight in kg'} value={row.kg} onChange={(e) => edit(row.id, { kg: e.target.value })} aria-invalid={invalid?.id === row.id && invalid.field === 'kg' ? true : undefined} style={css("width: 100%; box-sizing: border-box; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px; font-weight: 700; text-align: center")} />
              <input ref={(el) => { inputs.current[row.id + ':reps'] = el; }} type="text" inputMode="numeric" aria-label={'Set ' + n + ' reps'} placeholder={row.placeholder} value={row.reps} onChange={(e) => edit(row.id, { reps: e.target.value })} aria-invalid={invalid?.id === row.id && invalid.field === 'reps' ? true : undefined} style={css("width: 100%; box-sizing: border-box; height: 44px; border: 1px solid #FF6A00; border-radius: 12px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px; font-weight: 700; text-align: center")} />
              <button type="button" aria-label={'Mark set ' + n + ' done'} aria-pressed="false" onClick={() => toggle(row)} style={css("width: 44px; height: 44px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer")}><span style={css("width: 28px; height: 28px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #71717A")}></span></button>
            </div>
          );
        })}

        <button type="button" onClick={addSet} style={css("height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Add set
        </button>
      </section>

      <button type="button" aria-label="Incline dumbbell press, 0 of 3 sets" style={css("margin-top: 10px; width: 100%; min-height: 60px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; padding: 0 16px; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer")}>
        <span style={css("flex-grow: 1; display: flex; flex-direction: column; gap: 2px")}><span style={css("font-size: 15px; font-weight: 700")}>Incline dumbbell press</span><span style={css("font-size: 12px; color: #8E8E93")}>0 of 3 sets</span></span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </button>
      <button type="button" aria-label="Cable triceps pushdown, 0 of 3 sets" style={css("margin-top: 10px; width: 100%; min-height: 60px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; padding: 0 16px; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer")}>
        <span style={css("flex-grow: 1; display: flex; flex-direction: column; gap: 2px")}><span style={css("font-size: 15px; font-weight: 700")}>Cable triceps pushdown</span><span style={css("font-size: 12px; color: #8E8E93")}>0 of 3 sets</span></span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </button>
    </PhoneScreen>
  );
}
