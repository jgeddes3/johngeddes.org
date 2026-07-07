import React, { useState, useEffect, useRef } from 'react';
import './NewsTicker.css';

const NewsTicker = () => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (!res.ok) return;
        const data = await res.json();

        const stockItems = (data.quotes || []).map(({ symbol, c, dp }) => {
          const change = dp ? dp.toFixed(2) : '0.00';
          const isUp = (dp || 0) >= 0;
          return {
            type: 'stock',
            text: `${symbol} $${typeof c === 'number' ? c.toFixed(2) : '—'}`,
            change: `${isUp ? '+' : ''}${change}%`,
            isUp,
          };
        });

        const newsItems = (data.news || []).map(n => ({
          type: 'news',
          text: n.headline,
        }));

        // Interleave: stock, news, stock, news...
        const merged = [];
        const maxLen = Math.max(stockItems.length, newsItems.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < stockItems.length) merged.push(stockItems[i]);
          if (i < newsItems.length) merged.push(newsItems[i]);
        }
        // Add remaining news
        for (let i = stockItems.length; i < newsItems.length; i++) {
          merged.push(newsItems[i]);
        }

        setItems(merged);
      } catch (err) {
        console.error('Ticker fetch error:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const tickerContent = [...items, ...items];

  return (
    <div className="news-ticker-container">
      <div className="news-ticker-track" ref={scrollRef}>
        {tickerContent.map((item, i) => (
          <span key={i} className="news-ticker-item">
            {item.type === 'stock' ? (
              <>
                <span className="ticker-stock-symbol">{item.text}</span>
                <span className={`ticker-stock-change ${item.isUp ? 'ticker-up' : 'ticker-down'}`}>
                  {item.change}
                </span>
              </>
            ) : (
              <span className="ticker-headline">{item.text}</span>
            )}
            <span className="ticker-separator">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
