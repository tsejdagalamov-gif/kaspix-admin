'use client';

import { useState, useEffect } from 'react';

interface TimeZone {
  name: string;
  label: string;
  offset: string;
}

const timeZones: TimeZone[] = [
  { name: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC' },
  { name: 'Europe/London', label: '🇬🇧 London (GMT/BST)', offset: 'Europe/London' },
  { name: 'Europe/Paris', label: '🇫🇷 Paris (CET/CEST)', offset: 'Europe/Paris' },
  { name: 'Europe/Moscow', label: '🇷🇺 Moscow (MSK)', offset: 'Europe/Moscow' },
  { name: 'Asia/Dubai', label: '🇦🇪 Dubai (GST)', offset: 'Asia/Dubai' },
  { name: 'Asia/Bangkok', label: '🇹🇭 Bangkok (ICT)', offset: 'Asia/Bangkok' },
  { name: 'Asia/Shanghai', label: '🇨🇳 Shanghai (CST)', offset: 'Asia/Shanghai' },
  { name: 'Asia/Tokyo', label: '🇯🇵 Tokyo (JST)', offset: 'Asia/Tokyo' },
  { name: 'Asia/Singapore', label: '🇸🇬 Singapore (SGT)', offset: 'Asia/Singapore' },
  { name: 'Australia/Sydney', label: '🇦🇺 Sydney (AEDT/AEST)', offset: 'Australia/Sydney' },
  { name: 'Pacific/Auckland', label: '🇳🇿 Auckland (NZDT/NZST)', offset: 'Pacific/Auckland' },
  { name: 'America/Los_Angeles', label: '🇺🇸 Los Angeles (PST/PDT)', offset: 'America/Los_Angeles' },
  { name: 'America/Denver', label: '🇺🇸 Denver (MST/MDT)', offset: 'America/Denver' },
  { name: 'America/Chicago', label: '🇺🇸 Chicago (CST/CDT)', offset: 'America/Chicago' },
  { name: 'America/New_York', label: '🇺🇸 New York (EST/EDT)', offset: 'America/New_York' },
  { name: 'America/Toronto', label: '🇨🇦 Toronto (EST/EDT)', offset: 'America/Toronto' },
  { name: 'America/Mexico_City', label: '🇲🇽 Mexico City (CST/CDT)', offset: 'America/Mexico_City' },
  { name: 'America/Sao_Paulo', label: '🇧🇷 São Paulo (BRT/BRST)', offset: 'America/Sao_Paulo' },
  { name: 'America/Buenos_Aires', label: '🇦🇷 Buenos Aires (ART)', offset: 'America/Buenos_Aires' },
  { name: 'Africa/Cairo', label: '🇪🇬 Cairo (EET)', offset: 'Africa/Cairo' },
  { name: 'Africa/Johannesburg', label: '🇿🇦 Johannesburg (SAST)', offset: 'Africa/Johannesburg' },
  { name: 'India/Kolkata', label: '🇮🇳 Kolkata (IST)', offset: 'Asia/Kolkata' },
];

interface ClockData {
  timeZone: string;
  time: string;
  date: string;
  offset: string;
}

export default function ClockPage() {
  const [clocks, setClocks] = useState<ClockData[]>([]);
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>([
    'UTC',
    'Europe/Moscow',
    'America/New_York',
    'Asia/Tokyo',
  ]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const newClocks = selectedTimeZones.map((tz) => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const time = formatter.format(now);
        const date = dateFormatter.format(now);

        // Calculate offset
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
        const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
        const offsetSign = offset >= 0 ? '+' : '';
        const offsetStr = `UTC${offsetSign}${offset.toFixed(1)}`;

        const timeZoneLabel =
          timeZones.find((t) => t.name === tz)?.label || tz;

        return {
          timeZone: timeZoneLabel,
          time,
          date,
          offset: offsetStr,
        };
      });

      setClocks(newClocks);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeZones]);

  const handleTimeZoneToggle = (tz: string) => {
    setSelectedTimeZones((prev) => {
      if (prev.includes(tz)) {
        return prev.filter((t) => t !== tz);
      } else {
        return [...prev, tz];
      }
    });
  };

  const handleAddAll = () => {
    setSelectedTimeZones(timeZones.map((t) => t.name));
    setShowDropdown(false);
  };

  const handleClearAll = () => {
    setSelectedTimeZones([]);
  };

  return (
    <div className="clock-container">
      <div className="clock-header">
        <h1>🕐 Мировые часы</h1>
        <p>Отслеживайте время в разных часовых поясах</p>
      </div>

      <div className="clock-controls">
        <div className="dropdown-wrapper">
          <button
            className="dropdown-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⚙️ Выбрать часовые пояса ({selectedTimeZones.length})
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-actions">
                <button
                  className="action-button add-all"
                  onClick={handleAddAll}
                >
                  + Добавить все
                </button>
                <button
                  className="action-button clear-all"
                  onClick={handleClearAll}
                >
                  - Очистить
                </button>
              </div>

              <div className="timezone-list">
                {timeZones.map((tz) => (
                  <label key={tz.name} className="timezone-item">
                    <input
                      type="checkbox"
                      checked={selectedTimeZones.includes(tz.name)}
                      onChange={() => handleTimeZoneToggle(tz.name)}
                    />
                    <span>{tz.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="clocks-grid">
        {clocks.length > 0 ? (
          clocks.map((clock, index) => (
            <div key={index} className="clock-card">
              <div className="clock-timezone">{clock.timeZone}</div>
              <div className="clock-display">{clock.time}</div>
              <div className="clock-date">{clock.date}</div>
              <div className="clock-offset">{clock.offset}</div>
            </div>
          ))
        ) : (
          <div className="empty-clocks">
            <p>Выберите часовые пояса для отображения</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .clock-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          border-radius: 0;
        }

        .clock-header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .clock-header h1 {
          font-size: 40px;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .clock-header p {
          font-size: 16px;
          opacity: 0.9;
        }

        .clock-controls {
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
        }

        .dropdown-wrapper {
          position: relative;
          display: inline-block;
        }

        .dropdown-button {
          padding: 12px 20px;
          background-color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .dropdown-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 8px;
          max-width: 350px;
          max-height: 400px;
          overflow-y: auto;
        }

        .dropdown-actions {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .action-button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.add-all {
          background-color: #4caf50;
          color: white;
        }

        .action-button.add-all:hover {
          background-color: #45a049;
        }

        .action-button.clear-all {
          background-color: #f44336;
          color: white;
        }

        .action-button.clear-all:hover {
          background-color: #da190b;
        }

        .timezone-list {
          padding: 8px;
        }

        .timezone-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .timezone-item:hover {
          background-color: #f0f0f0;
        }

        .timezone-item input {
          margin-right: 10px;
          cursor: pointer;
        }

        .timezone-item span {
          font-size: 14px;
          color: #333;
        }

        .clocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .clock-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: all 0.3s ease;
          text-align: center;
          border-top: 4px solid #667eea;
        }

        .clock-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .clock-timezone {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .clock-display {
          font-size: 48px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 12px;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }

        .clock-date {
          font-size: 14px;
          color: #999;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .clock-offset {
          font-size: 12px;
          background: #f0f4ff;
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          display: inline-block;
          font-weight: 600;
        }

        .empty-clocks {
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
        }

        .empty-clocks p {
          font-size: 18px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .clock-header h1 {
            font-size: 28px;
          }

          .clocks-grid {
            grid-template-columns: 1fr;
          }

          .clock-display {
            font-size: 36px;
          }

          .dropdown-menu {
            max-width: calc(100vw - 40px);
          }
        }
      `}</style>
    </div>
  );
}
