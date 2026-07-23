// SettingsPage.jsx
import React, { useState } from 'react';
import { Card } from './shared/SharedComponents';

/**
 * SettingsPage - User profile and application settings
 * 
 * @param {boolean} dark - Current theme mode
 * @param {Function} onToggleDark - Toggle theme function
 */
/* 
  CHANGES:
  - Extracted ToggleSwitch helper component outside the render loop to prevent focus loss issues on re-render.
*/
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
      checked ? 'bg-primary' : 'bg-switch-background'
    }`}
  >
    <span
      className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
      style={{
        width: '18px',
        height: '18px',
        top: '2px',
        left: checked ? 'calc(100% - 20px)' : '2px',
      }}
    />
  </button>
);

/**
 * SettingsPage - User profile and application settings
 * 
 * @param {boolean} dark - Current theme mode
 * @param {Function} onToggleDark - Toggle theme function
 * @param {string} currency - Current selected currency code
 * @param {Function} onCurrencyChange - Callback to change app currency
 * @param {Function} onResetAll - Callback to reset all application data
 */
/* 
  CHANGES:
  - Added destructured settings props: currency, onCurrencyChange, and onResetAll.
  - Removed duplicate local currency state to use global parent state instead.
*/
const SettingsPage = ({ dark, onToggleDark, currency, onCurrencyChange, onResetAll }) => {
  const [notifications, setNotifications] = useState({
    budget: true,
    weekly: false,
    monthly: true,
  });
  const [saved, setSaved] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Profile</h3>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xl font-semibold">
            JD
          </div>

          <div>
            <p className="font-semibold text-foreground">Jane Doe</p>
            <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Settings</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Preferred currency
            </label>
            {/* 
              CHANGES:
              - Bound select value to global currency prop instead of local state.
              - Wired up onChange to call the parent's onCurrencyChange handler.
              - Mapped option values to standard ISO currency codes (USD, EUR, PKR, etc.).
            */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (Rs)</option>
              <option value="INR">INR (₹)</option>
              <option value="SAR">SAR (SR)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Theme mode
            </label>
            {/* CHANGES: Updated styling to support dark mode label rendering */}
            <button
              type="button"
              onClick={onToggleDark}
              className="w-full rounded-xl border border-slate-300  bg-white  text-slate-900  px-4 py-3 text-left text-sm hover:bg-slate-100  transition"
            >
              {dark ? 'Dark' : 'Light'} mode
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Notifications</h3>

        <div className="space-y-4">
          {['budget', 'weekly', 'monthly'].map((key) => (
            /* CHANGES: Updated border classes for dark mode support */
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200  bg-white  px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {key === 'budget'
                    ? 'Budget alerts'
                    : key === 'weekly'
                    ? 'Weekly summary'
                    : 'Monthly recap'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {key === 'budget'
                    ? 'Alerts when spending exceeds budget'
                    : key === 'weekly'
                    ? 'Weekly financial summary'
                    : 'Monthly savings recap'}
                </p>
              </div>
              <ToggleSwitch checked={notifications[key]} onChange={() => toggleNotification(key)} />
            </div>
          ))}
        </div>
      </Card>

      {/* 
        CHANGES:
        - Added a new Danger Zone section to manage data reset.
        - Connected the button to the parent's resetAll function.
      */}
      <Card className="p-6 border-red-200  bg-red-50/10">
        <h3 className="text-sm font-semibold text-red-600  mb-2">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Resetting will permanently clear all your transactions and restore initial budget limits.
        </p>
        <button
          type="button"
          onClick={onResetAll}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
        >
          Reset All Data
        </button>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {saved && (
          <p className="text-sm text-emerald-600 ">Settings saved successfully.</p>
        )}
        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
