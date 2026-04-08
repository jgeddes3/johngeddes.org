import React, { useState, useEffect, useRef } from 'react';
import './NewsTicker.css';

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'SPY', 'TSLA'];

const NewsTicker = () => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!FINNHUB_KEY) return;

    const fetchData = async () => {
      try {
        const [newsRes, ...quoteResults] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`),
          ...STOCK_SYMBOLS.map(s =>
            fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${FINNHUB_KEY}`)
          ),
        ]);

        const news = await newsRes.json();
        const quotes = await Promise.all(quoteResults.map(r => r.json()));

        const stockItems = STOCK_SYMBOLS.map((symbol, i) => {
          const q = quotes[i];
          const change = q.dp ? q.dp.toFixed(2) : '0.00';
          const isUp = q.dp >= 0;
          return {
            type: 'stock',
            text: `${symbol} $${q.c?.toFixed(2) || '—'}`,
            change: `${isUp ? '+' : ''}${change}%`,
            isUp,
          };
        });

        const newsItems = (news || []).slice(0, 15).map(n => ({
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

  if (!FINNHUB_KEY || items.length === 0) return null;

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
