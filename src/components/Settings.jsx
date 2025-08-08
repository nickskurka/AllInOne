import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="card">
      <h2>Settings</h2>
      <div className="input-group">
        <label>Theme</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Light</span>
          <button
            onClick={toggleTheme}
            className="btn"
            style={{
              backgroundColor: theme === 'dark' ? '#007bff' : '#6c757d',
              color: 'white',
              padding: '5px 15px'
            }}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
          <span>Dark</span>
        </div>
      </div>
      <div className="input-group">
        <label>Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</label>
      </div>
    </div>
  );
};

export default Settings;
