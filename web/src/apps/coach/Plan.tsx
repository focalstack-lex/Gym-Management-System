// Canvas artboard Coach-Plan: the plan builder for one client, with day tabs.
// The canvas draws Day A only, so Days B and C show their heading with no exercises yet.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { useDemo } from '../../demo/store';

interface Exercise {
  name: string;
  detail: string;
  sets: number;
  reps: string;
  rest: string;
}

// Day A matches the member's Workout log: 4 + 3 + 3 = 10 sets.
const EXERCISES: Exercise[] = [
  { name: 'Bench press', detail: 'Barbell, build to 75 kg', sets: 4, reps: '6', rest: '2:00' },
  { name: 'Incline dumbbell press', detail: 'Dumbbell, 30 degree bench', sets: 3, reps: '10', rest: '1:30' },
  { name: 'Cable triceps pushdown', detail: 'Cable, rope attachment', sets: 3, reps: '12', rest: '1:00' },
];

const DAYS = [
  { key: 'A', tab: 'A Push', heading: 'Day A, chest + triceps' },
  { key: 'B', tab: 'B Pull', heading: 'Day B, pull' },
  { key: 'C', tab: 'C Legs', heading: 'Day C, legs' },
];

const LIBRARY: Exercise[] = [
  { name: 'Cable fly', detail: 'Chest, cable', sets: 3, reps: '12', rest: '1:15' },
  { name: 'Dips', detail: 'Triceps, bodyweight', sets: 3, reps: '10', rest: '1:30' },
];

export default function Plan() {
  const { dispatch } = useDemo();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('A');
  const [query, setQuery] = useState('');
  const [plans, setPlans] = useState<Record<string, Exercise[]>>({ A: EXERCISES, B: [], C: [] });
  const day = DAYS.find((d) => d.key === selected) ?? DAYS[0];
  const exercises = plans[selected] ?? [];
  const totalSets = exercises.reduce((n, e) => n + e.sets, 0);
  const needle = query.trim().toLowerCase();
  const suggestions = needle ? LIBRARY.filter((e) => `${e.name} ${e.detail}`.toLowerCase().includes(needle)) : LIBRARY;

  const add = (exercise: Exercise) => {
    setPlans((prev) => {
      const list = prev[selected] ?? [];
      if (list.some((e) => e.name === exercise.name)) return prev;
      return { ...prev, [selected]: [...list, exercise] };
    });
    setQuery('');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPlans((prev) => {
      const list = [...(prev[selected] ?? [])];
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      return { ...prev, [selected]: list };
    });
  };

  const save = () => {
    dispatch({ type: 'logAudit', action: 'Plan saved and assigned', target: 'Mika Santos', detail: `${day.heading}, ${totalSets} sets` });
    navigate('/coach/clients');
  };

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={150}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 10px")}>
          <button type="button" onClick={() => navigate('/m/workout')} style={css("height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer")}>Preview</button>
          <button type="button" onClick={save} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Save and assign</button>
        </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
        <Link to="/coach/clients" aria-label="Back to clients" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
          <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Plan for Mika</h1>
          <span style={css("font-size: 12px; color: #8E8E93")}>Push, pull, legs, 4 days a week</span>
        </div>
        <button type="button" aria-label="Plan options" style={css("width: 44px; height: 44px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; background: #17171A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
      </header>

      <div role="tablist" aria-label="Plan day" style={css("margin-top: 18px; display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
        {DAYS.map((d) => {
          const on = d.key === selected;
          return (
            <button
              key={d.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSelected(d.key)}
              style={on
                ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer")
                : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer")}
            >{d.tab}</button>
          );
        })}
      </div>

      <section aria-label={`Day ${day.key} exercises`} style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 12px 8px 4px 4px")}>
        <div style={css("display: flex; align-items: baseline; justify-content: space-between; padding: 0 8px 8px 12px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{day.heading}</span>
          <span style={css("font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("color: #FFFFFF; font-weight: 700")}>{totalSets}</span> sets</span>
        </div>
        <ol style={css("list-style: none; margin: 0; padding: 0")}>
          {exercises.map((e, index) => (
            <li key={e.name} style={css("display: flex; align-items: center; gap: 4px; min-height: 64px; border-top: 1px solid rgba(255,255,255,0.06)")}>
              <button type="button" aria-label={`Reorder ${e.name}`} onClick={() => moveUp(index)} style={css("width: 36px; height: 44px; flex-shrink: 0; border: 0; background: transparent; color: #71717A; display: flex; align-items: center; justify-content: center; cursor: grab")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg></button>
              <span style={css("display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0")}>
                <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{e.name}</span>
                <span style={css("font-size: 12px; color: #8E8E93; white-space: nowrap")}>{e.detail}</span>
              </span>
              <span style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding-right: 4px")}>
                <span style={css("font-size: 20px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>{e.sets}<span style={css("font-size: 12px; font-weight: 600; color: #8E8E93")}> x {e.reps}</span></span>
                <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>rest {e.rest}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <label style={css("margin-top: 12px; display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 14px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px dashed rgba(255,255,255,0.14)")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
        <span style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Add exercise from library</span>
        <input type="search" placeholder="Add from exercise library" value={query} onChange={(e) => setQuery(e.target.value)} style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 15px; outline: none")} />
      </label>

      <section aria-label="Library suggestions" style={css("margin-top: 12px")}>
        <span style={css("display: block; padding: 0 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Often paired</span>
        <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
          {suggestions.map((e) => (
            <button key={e.name} type="button" onClick={() => add(e)} style={css("min-height: 56px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #17171A; color: #FFFFFF; font-family: inherit; text-align: left; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; cursor: pointer")}><span style={css("font-size: 14px; font-weight: 700")}>{e.name}</span><span style={css("font-size: 11px; color: #8E8E93")}>{e.detail}</span></button>
          ))}
        </div>
      </section>
    </PhoneScreen>
  );
}
