// Port of the seven Member-Share* artboards: one component with the overlay style picker.
// ?style=Minimal (Stats, Minimal, Streak, Top sets or Lifts, PR, Month, Clean) picks the
// initial style. Choose photo and Take photo replace the preview photo on this device only.

import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

const NAMES = ['Stats', 'Minimal', 'Streak', 'Top sets', 'PR', 'Month', 'Clean'] as const;
type Style = (typeof NAMES)[number];

function initialStyle(query: string | null): Style {
  const q = (query ?? '').trim().toLowerCase();
  if (q === 'lifts') return 'Top sets';
  return NAMES.find((n) => n.toLowerCase() === q) ?? 'Stats';
}

// October 2026 starts on a Thursday: 3 empty cells, then 31 days. Mika's visits are orange.
function monthCells() {
  const visits = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 14, 17];
  const cells = [0, 1, 2].map(() => ({ bg: 'transparent', border: '0' }));
  for (let d = 1; d <= 31; d++) {
    if (visits.includes(d)) cells.push({ bg: '#FF6A00', border: '0' });
    else if (d > 17) cells.push({ bg: 'transparent', border: '1px solid rgba(255,255,255,0.25)' });
    else cells.push({ bg: 'rgba(255,255,255,0.22)', border: '0' });
  }
  while (cells.length % 7) cells.push({ bg: 'transparent', border: '0' });
  return cells;
}

// This week Mon Oct 12 to Sun Oct 18: visits Mon, Wed, Sat (today).
const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => {
  const visited = i === 0 || i === 2 || i === 5;
  const future = i === 6;
  return { l, bg: visited ? '#FF6A00' : future ? 'transparent' : '#3F3F46', border: future ? '1px solid #71717A' : '0' };
});

const LIFTS = [
  { name: 'Bench press', load: '75 kg', reps: 'x 6' },
  { name: 'Incline dumbbell press', load: '26 kg', reps: 'x 10' },
  { name: 'Cable triceps pushdown', load: '30 kg', reps: 'x 12' },
];

const MONTH = monthCells();

export function Share() {
  const [params] = useSearchParams();
  const [current, setCurrent] = useState<Style>(() => initialStyle(params.get('style')));
  const [photo, setPhoto] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const chooseRef = useRef<HTMLInputElement>(null);
  const takeRef = useRef<HTMLInputElement>(null);
  const figureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  function pickStyle(name: Style) {
    setCurrent(name);
    const figure = figureRef.current;
    if (!figure) return;
    // Re-adding the class restarts the shared CSS keyframe without remounting the photo.
    figure.classList.remove('share-card-swap');
    requestAnimationFrame(() => figure.classList.add('share-card-swap'));
  }

  // Rasterize the 252 x 448 preview at 1080 x 1920. html2canvas draws the DOM directly onto a
  // canvas; the SVG foreignObject route taints the canvas in Chromium and cannot be exported.
  async function saveImage() {
    const node = figureRef.current;
    if (!node) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(node, {
        backgroundColor: '#0C0C0E',
        scale: 1080 / 252,
        useCORS: true,
        logging: false,
        onclone: (document) => {
          // The preview's 1px hairline would add 8px to the 1080 x 1920 output.
          const clone = document.querySelector('figure');
          if (clone) {
            clone.classList.remove('share-card-swap');
            clone.style.border = '0';
            clone.style.width = '252px';
            clone.style.height = '448px';
          }
        },
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          setNotice('Could not save the image on this device.');
          return;
        }
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'infinity-workout.png';
        link.click();
        URL.revokeObjectURL(href);
        setNotice('Saved as a 1080 x 1920 image.');
      }, 'image/png');
    } catch (error) {
      console.error('Share image export failed', error);
      setNotice('Could not save the image on this device.');
    }
  }

  function onPhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice('That file is not an image.');
      return;
    }
    setNotice('');
    setPhoto(URL.createObjectURL(file));
  }

  async function share() {
    const text = 'Chest + Triceps, 58 min, 4,700 kg, 10 sets. The Infinity Fitness';
    if (typeof navigator.share !== 'function') {
      setNotice('Sharing is not available on this device.');
      return;
    }
    try {
      await navigator.share({ title: 'Share workout', text });
      setNotice('');
    } catch (error) {
      // Closing the share sheet is not a failure.
      if (!(error instanceof DOMException && error.name === 'AbortError')) setNotice('Could not open the share sheet.');
    }
  }

  const scrim = current === 'Minimal' || current === 'Clean' ? '0.30' : '0.18';

  const bar = (
    <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 20px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 10px")}>
      <button type="button" onClick={saveImage} style={css("height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path></svg>Save image</button>
      <button type="button" onClick={share} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="m16 6-4-4-4 4"></path><path d="M12 2v13"></path></svg>Share</button>
    </div>
  );

  return (
    <PhoneScreen padding="52px 20px 0" bars={bar} bottomInset={130}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <Link to="/m/workout" aria-label="Back to workout" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <div style={css("display: flex; flex-direction: column; align-items: center; gap: 2px")}>
          <h1 style={css("margin: 0; font-size: 17px; font-weight: 700")}>Share workout</h1>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>Workout saved</span>
        </div>
        <Link to="/m/today" aria-label="Close, back to today" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></Link>
      </header>

      <figure ref={figureRef} className="share-card-swap" aria-label={'Story image preview, 9:16, ' + current + ' style'} style={css("margin: 14px auto 0; position: relative; width: 252px; height: 448px; border-radius: 22px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); background: #17171A")}>
        <img src={photo ?? '/brand/gym-floor.jpg'} alt="Your photo: the gym training floor" style={css("width: 100%; height: 100%; object-fit: cover; object-position: center 70%; display: block")} />
        <div aria-hidden="true" style={css(`position: absolute; inset: 0; background: rgba(12,12,14,${scrim})`)}></div>

        <div style={css("position: absolute; left: 14px; top: 14px; display: flex; align-items: center; gap: 8px")}>
          <span style={css("width: 28px; height: 28px; border-radius: 8px; background: #FFFFFF; overflow: hidden")}><img src="/brand/logo.jpg" alt="" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></span>
          <span style={css("font-size: 10px; font-weight: 800; font-stretch: 125%; letter-spacing: 0.02em")}>THE INFINITY FITNESS</span>
        </div>

        {current === 'Stats' && (
          <div style={css("position: absolute; left: 10px; right: 10px; bottom: 10px; border-radius: 16px; background: rgba(12,12,14,0.72); border: 1px solid rgba(255,255,255,0.08); padding: 14px; display: flex; flex-direction: column; gap: 12px")}>
            <div style={css("display: flex; flex-direction: column; gap: 2px")}>
              <span style={css("font-size: 20px; font-weight: 800; font-stretch: 110%")}>Chest + Triceps</span>
              <span style={css("font-size: 11px; color: #A1A1AA")}>Sat, Oct 17 · Digos City</span>
            </div>
            <div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr))")}>
              <span style={css("display: flex; flex-direction: column; gap: 3px")}><span style={css("font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A1A1AA")}>Time</span><span style={css("font-size: 18px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>58<span style={css("font-size: 12px; color: #A1A1AA")}>m</span></span></span>
              <span style={css("display: flex; flex-direction: column; gap: 3px; padding-left: 10px; border-left: 1px solid rgba(255,255,255,0.12)")}><span style={css("font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A1A1AA")}>Volume</span><span style={css("font-size: 18px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>4,700<span style={css("font-size: 12px; color: #A1A1AA")}> kg</span></span></span>
              <span style={css("display: flex; flex-direction: column; gap: 3px; padding-left: 10px; border-left: 1px solid rgba(255,255,255,0.12)")}><span style={css("font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A1A1AA")}>Sets</span><span style={css("font-size: 18px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>10</span></span>
            </div>
          </div>
        )}

        {current === 'Minimal' && (
          <div style={css("position: absolute; left: 16px; right: 16px; bottom: 18px; display: flex; flex-direction: column; gap: 4px")}>
            <span style={css("font-size: 52px; line-height: 0.9; font-weight: 800; font-stretch: 120%; letter-spacing: -0.02em; font-variant-numeric: tabular-nums")}>58:12</span>
            <span style={css("font-size: 15px; font-weight: 700")}>Chest + Triceps</span>
            <span style={css("font-size: 11px; color: #E4E4E7")}>4,700 kg · 10 sets · Sat, Oct 17</span>
          </div>
        )}

        {current === 'Streak' && (
          <div style={css("position: absolute; left: 10px; right: 10px; bottom: 10px; border-radius: 16px; background: rgba(12,12,14,0.72); border: 1px solid rgba(255,255,255,0.08); padding: 14px; display: flex; flex-direction: column; gap: 12px")}>
            <div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
              <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                <span style={css("display: inline-flex; align-items: center; gap: 5px; font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #FF6A00")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>Streak</span>
                <span style={css("font-size: 40px; line-height: 0.9; font-weight: 800; font-stretch: 120%; font-variant-numeric: tabular-nums")}>6<span style={css("font-size: 13px; font-weight: 600; color: #A1A1AA")}> weeks</span></span>
              </span>
              <span style={css("font-size: 11px; color: #A1A1AA; text-align: right")}>3 of 4 visits<br />this week</span>
            </div>
            <div aria-hidden="true" style={css("display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center; font-size: 9px; color: #A1A1AA")}>
              {WEEK.map((d, i) => (
                <span key={i} style={css("display: flex; flex-direction: column; align-items: center; gap: 5px")}>{d.l}<span style={css(`width: 8px; height: 8px; box-sizing: border-box; border-radius: 50%; background: ${d.bg}; border: ${d.border}`)}></span></span>
              ))}
            </div>
          </div>
        )}

        {current === 'Top sets' && (
          <div style={css("position: absolute; left: 10px; right: 10px; bottom: 10px; border-radius: 16px; background: rgba(12,12,14,0.72); border: 1px solid rgba(255,255,255,0.08); padding: 14px; display: flex; flex-direction: column; gap: 10px")}>
            <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 8px")}>
              <span style={css("font-size: 17px; font-weight: 800; font-stretch: 110%")}>Top sets</span>
              <span style={css("font-size: 10px; color: #A1A1AA")}>Chest + Triceps</span>
            </div>
            {LIFTS.map((l) => (
              <div key={l.name} style={css("display: flex; align-items: baseline; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.12)")}>
                <span style={css("flex-grow: 1; min-width: 0; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{l.name}</span>
                <span style={css("font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap")}>{l.load}<span style={css("font-size: 11px; font-weight: 600; color: #A1A1AA")}> {l.reps}</span></span>
              </div>
            ))}
            <span style={css("font-size: 10px; color: #A1A1AA")}>58 min · 10 sets · 4,700 kg</span>
          </div>
        )}

        {current === 'PR' && (
          <div style={css("position: absolute; left: 10px; right: 10px; bottom: 10px; border-radius: 16px; background: rgba(12,12,14,0.72); border: 1px solid rgba(255,255,255,0.08); padding: 14px; display: flex; flex-direction: column; gap: 8px")}>
            <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A1A1AA; color: #FF6A00")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>New personal record</span>
            <span style={css("font-size: 54px; line-height: 0.9; font-weight: 800; font-stretch: 120%; letter-spacing: -0.02em; font-variant-numeric: tabular-nums")}>75<span style={css("font-size: 18px; font-weight: 700; color: #A1A1AA")}> kg</span></span>
            <span style={css("font-size: 15px; font-weight: 700")}>Bench press, 6 reps</span>
            <span style={css("font-size: 11px; color: #A1A1AA")}>Up 5 kg from 70 kg on Sep 19</span>
          </div>
        )}

        {current === 'Month' && (
          <div style={css("position: absolute; left: 10px; right: 10px; bottom: 10px; border-radius: 16px; background: rgba(12,12,14,0.72); border: 1px solid rgba(255,255,255,0.08); padding: 14px; display: flex; flex-direction: column; gap: 10px")}>
            <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 8px")}>
              <span style={css("font-size: 17px; font-weight: 800; font-stretch: 110%")}>October</span>
              <span style={css("font-size: 11px; color: #A1A1AA")}><span style={css("font-size: 15px; font-weight: 800; color: #FFFFFF")}>12</span> visits</span>
            </div>
            <div aria-hidden="true" style={css("display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); row-gap: 6px; justify-items: center")}>
              {MONTH.map((m, i) => (
                <span key={i} style={css(`width: 9px; height: 9px; box-sizing: border-box; border-radius: 50%; background: ${m.bg}; border: ${m.border}`)}></span>
              ))}
            </div>
            <span style={css("font-size: 10px; color: #A1A1AA")}>6 week streak · The Infinity Fitness</span>
          </div>
        )}

        {current === 'Clean' && (
          <div style={css("position: absolute; left: 16px; right: 16px; bottom: 18px; display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("width: 28px; height: 2px; background: #FFFFFF")}></span>
            <span style={css("font-size: 13px; font-weight: 700")}>Chest + Triceps</span>
            <span style={css("font-size: 11px; color: #E4E4E7; font-variant-numeric: tabular-nums")}>58:12 · 4,700 kg · Sat, Oct 17</span>
          </div>
        )}
      </figure>

      <div role="tablist" aria-label="Overlay style" style={css("margin: 14px -20px 0; padding: 0 20px; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none")}>
        {NAMES.map((name) => {
          const on = name === current;
          return (
            <button key={name} type="button" role="tab" aria-selected={on ? 'true' : 'false'} onClick={() => pickStyle(name)} style={css(`flex: 0 0 auto; height: 44px; padding: 0 16px; border: ${on ? '1px solid #FF6A00' : '1px solid rgba(255,255,255,0.06)'}; border-radius: 12px; background: ${on ? '#1F1F23' : '#17171A'}; color: ${on ? '#FFFFFF' : '#8E8E93'}; font-family: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; cursor: pointer`)}>{name}</button>
          );
        })}
      </div>

      <div style={css("margin-top: 10px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
        <button type="button" onClick={() => takeRef.current?.click()} style={css("height: 48px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>Take photo</button>
        <button type="button" onClick={() => chooseRef.current?.click()} style={css("height: 48px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>Choose photo</button>
      </div>
      <input ref={takeRef} type="file" accept="image/*" capture="user" hidden aria-hidden="true" tabIndex={-1} onChange={(e) => onPhoto(e.target.files?.[0])} />
      <input ref={chooseRef} type="file" accept="image/*" hidden aria-hidden="true" tabIndex={-1} onChange={(e) => onPhoto(e.target.files?.[0])} />
      <p role="status" style={css("margin: 8px 4px 0; font-size: 11px; line-height: 1.4; color: #8E8E93")}>{notice || 'Story size, 1080 x 1920. Your photo stays on your phone until you share.'}</p>
    </PhoneScreen>
  );
}
