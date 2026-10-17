// Port of design/canvas/Desk-Mobile-Enroll.dc.html. A valid details form creates the member in
// the demo store and hands the activation slip the new name, member code and activation code.

import type { ChangeEvent, MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { addDays, parts } from '../../domain/dates';
import type { IsoDate } from '../../domain/dates';
import { periodEnd } from '../../domain/coverage';
import { nextMemberCode } from '../../demo/state';
import { useDemo } from '../../demo/store';
import { css } from '../../lib/css';
import { newActivationCode } from './_qr';

type FieldKey = 'name' | 'nickname' | 'mobile' | 'month' | 'day' | 'ecName' | 'ecMobile' | 'email';
type Values = Record<FieldKey, string>;
type Control = HTMLInputElement | HTMLSelectElement;

const EMPTY: Values = { name: '', nickname: '', mobile: '', month: '', day: '', ecName: '', ecMobile: '', email: '' };
const digits = (s: string) => s.replace(/\D/g, '');
const MOBILE = /^9\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabel = (date: IsoDate) => {
  const p = parts(date);
  return `${MONTHS[p.month - 1]} ${p.day}`;
};

export default function Enroll() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [v, setV] = useState<Values>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fields = useRef<Partial<Record<FieldKey, Control | null>>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  const field = (key: FieldKey) => (el: Control | null) => {
    fields.current[key] = el;
  };
  const set = (key: FieldKey, value: string) => {
    fields.current[key]?.setCustomValidity('');
    setV((prev) => ({ ...prev, [key]: value }));
  };
  const toggleConsent = (on: boolean) => {
    setConsent(on);
    // A photo is only kept while the member's consent stands.
    if (!on) setPhoto(null);
  };
  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!consent || !file || !file.type.startsWith('image/')) return;
    setPhoto(URL.createObjectURL(file));
  };

  // The first invalid field with its message, or null when the form can proceed.
  const firstProblem = (): [FieldKey, string] | null => {
    if (!v.name.trim()) return ['name', 'Enter the full name'];
    if (!MOBILE.test(v.mobile)) return ['mobile', 'Enter the 10 digits after +63, starting with 9'];
    if (!v.month) return ['month', 'Choose the birth month'];
    if (!v.day) return ['day', 'Choose the birth day'];
    if (!v.ecName.trim()) return ['ecName', 'Enter the emergency contact name'];
    if (!MOBILE.test(v.ecMobile)) return ['ecMobile', 'Enter the 10 digits after +63, starting with 9'];
    if (v.email.trim() && !EMAIL.test(v.email.trim())) return ['email', 'Enter a valid email or leave it empty'];
    return null;
  };

  const onEnroll = (e: MouseEvent) => {
    e.preventDefault();
    const problem = firstProblem();
    if (problem) {
      const el = fields.current[problem[0]];
      if (!el) return;
      el.setCustomValidity(problem[1]);
      el.reportValidity();
      return;
    }
    if (!state.online) {
      const el = fields.current.name;
      if (!el) return;
      el.setCustomValidity('Enrollment takes payment, so it is not available offline');
      el.reportValidity();
      return;
    }
    const name = v.name.trim();
    const memberCode = nextMemberCode(state);
    const start = addDays(state.today, 1);
    const coverageEnd = periodEnd(start, 1);
    dispatch({ type: 'enroll', name, nickname: v.nickname.trim() || null, plan: 'Monthly', months: 1, mode: 'cash' });
    navigate('/desk/enroll/activation', {
      state: {
        name,
        memberCode,
        activationCode: newActivationCode(),
        coverageLabel: `Paid, Monthly, ${dayLabel(start)} to ${dayLabel(coverageEnd)}`,
      },
    });
  };

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={0}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px")}>
            <Link to="/desk/enroll/activation" onClick={onEnroll} className="pressable" style={css("height: 54px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800")}>Enroll and take payment</Link>
            <span style={css("font-size: 12px; color: #8E8E93; text-align: center")}>Step 1 of 3. Plan and payment come next.</span>
          </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
          <Link to="/desk/checkin" aria-label="Back to check-in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m15 18-6-6 6-6"></path></svg></Link>
          <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
            <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>New member</h1>
            <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span>Online, Ana R. on shift</span>
          </div>
        </header>

        <ol aria-label="Steps" style={css("list-style: none; margin: 16px 0 0; padding: 0; display: flex; align-items: center; gap: 8px")}>
          <li aria-current="step" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #FF6A00; color: #FF6A00; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800")}>1</span>Details</li>
          <li aria-hidden="true" style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.12)")}></li>
          <li style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #8E8E93; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px")}>2</span>Plan</li>
          <li aria-hidden="true" style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.12)")}></li>
          <li style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #8E8E93; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px")}>3</span>Payment</li>
        </ol>

        <form id="enroll" aria-label="Member details" noValidate onSubmit={(e) => e.preventDefault()} style={css("margin: 16px 0 150px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Full name</span>
              <input type="text" ref={field("name")} value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="First and last name" autoComplete="off" autoCapitalize="words" style={css("height: 48px; box-sizing: border-box; border: 1px solid #FF6A00; border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
            </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Nickname</span>
              <input type="text" value={v.nickname} onChange={(e) => set("nickname", e.target.value)} placeholder="What the member goes by" autoComplete="off" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
            </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Mobile</span>
            <span style={css("display: flex; gap: 8px")}>
              <span style={css("height: 48px; box-sizing: border-box; padding: 0 12px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #A1A1AA")}>+63</span>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder="9XX XXX XXXX" ref={field("mobile")} value={v.mobile} onChange={(e) => set("mobile", digits(e.target.value))} aria-label="Mobile number after +63" style={css("flex: 1; min-width: 0; height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: 0.04em")} />
            </span>
          </label>
          <div style={css("display: flex; flex-direction: column; gap: 8px")}>
            <div style={css("display: flex; gap: 10px")}>
              <label style={css("flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Birth month</span>
                <span style={css("position: relative; display: block")}>
                  <select ref={field("month")} value={v.month} onChange={(e) => set("month", e.target.value)} style={css("width: 100%; height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 36px 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px; appearance: none; -webkit-appearance: none")}><option value="">Month</option><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option><option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select>
                  <span style={css("position: absolute; right: 12px; top: 0; bottom: 0; display: flex; align-items: center; pointer-events: none; color: #8E8E93")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m6 9 6 6 6-6"></path></svg></span>
                </span>
              </label>
              <label style={css("flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Birth day</span>
                <span style={css("position: relative; display: block")}>
                  <select ref={field("day")} value={v.day} onChange={(e) => set("day", e.target.value)} style={css("width: 100%; height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 36px 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px; appearance: none; -webkit-appearance: none")}><option value="">Day</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option></select>
                  <span style={css("position: absolute; right: 12px; top: 0; bottom: 0; display: flex; align-items: center; pointer-events: none; color: #8E8E93")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m6 9 6 6 6-6"></path></svg></span>
                </span>
              </label>
            </div>
            <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>We never ask for birth year</span>
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06)")}>
            <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Emergency contact name</span>
              <input type="text" ref={field("ecName")} value={v.ecName} onChange={(e) => set("ecName", e.target.value)} placeholder="Full name" autoComplete="off" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
            </label>
            <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Emergency contact mobile</span>
              <span style={css("display: flex; gap: 8px")}>
              <span style={css("height: 48px; box-sizing: border-box; padding: 0 12px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #A1A1AA")}>+63</span>
              <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10} placeholder="9XX XXX XXXX" ref={field("ecMobile")} value={v.ecMobile} onChange={(e) => set("ecMobile", digits(e.target.value))} aria-label="Emergency contact mobile after +63" style={css("flex: 1; min-width: 0; height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: 0.04em")} />
            </span>
            </label>
            <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Email, optional</span>
              <input type="email" ref={field("email")} value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="name@example.com" autoComplete="off" inputMode="email" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
            </label>
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06)")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Desk photo</span>
            <div style={css("display: flex; align-items: flex-end; gap: 14px")}>
              <div role="img" aria-label={photo ? "Photo taken" : "No photo taken yet"} style={css("width: 96px; height: 96px; flex-shrink: 0; box-sizing: border-box; border-radius: 16px; background: #0C0C0E; border: 1px dashed #3F3F46; display: flex; align-items: center; justify-content: center; color: #71717A")}>{photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16, display: "block" }} /> : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path></svg>}</div>
              <input ref={fileRef} type="file" accept="image/*" capture="user" hidden onChange={onPhoto} />
              <button type="button" disabled={!consent} onClick={() => fileRef.current?.click()} style={css("height: 48px; padding: 0 16px; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>Take photo</button>
            </div>
            <label style={css("display: flex; align-items: flex-start; gap: 12px; min-height: 44px; font-size: 14px; line-height: 1.4; font-weight: 600")}>
              <input type="checkbox" required checked={consent} onChange={(e) => toggleConsent(e.target.checked)} style={css("width: 24px; height: 24px; flex-shrink: 0; margin: 0; accent-color: #FFFFFF")} />
              <span>Member agrees to a desk photo for check-in (RA 10173)</span>
            </label>
            <span style={css("font-size: 12px; line-height: 1.45; color: #8E8E93")}>Consent is required before a photo is taken. Without it, the photo stays empty and the member checks in by name or pass.</span>
          </div>
        </form>
    </PhoneScreen>
  );
}
