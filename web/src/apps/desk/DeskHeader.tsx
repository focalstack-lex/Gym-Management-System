// Phone connectivity header shared by the desk screens: green dot online, amber ring offline with the outbox size.

import { css } from '../../lib/css';

export function DeskHeader({ title, heading, online, outbox }: { title: string; heading?: boolean; online: boolean; outbox: number }) {
  const offline = !online;
  return (
  <header style={css("display: flex; align-items: center; gap: 12px")}>
    <div style={css("width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}><img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
    <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
      {heading ? <h1 style={css("margin: 0; font-size: 17px; font-weight: 800")}>{title}</h1> : <span style={css("font-size: 17px; font-weight: 800")}>{title}</span>}
      {online && (<>
        <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span>Online, Ana R. on shift</span>
      </>)}
      {offline && (<>
        <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 7px; height: 7px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #FF9F0A")}></span><span style={css("color: #FF9F0A; font-weight: 700")}>Offline</span> · Outbox: {outbox}</span>
      </>)}
    </div>
    <span style={css("font-size: 20px; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>6:42<span style={css("font-size: 12px; font-weight: 600; color: #8E8E93")}> PM</span></span>
  </header>
  );
}
