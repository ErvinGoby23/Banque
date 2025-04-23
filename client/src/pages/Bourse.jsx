import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bourse.css";

const Bourse = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const actions = [
    "AAPL", "TSLA", "GOOGL", "AMZN", "META",
    "NVDA", "LVMUY", "SNY", "TOT", "BNPQY"
  ];

  const apiKey = "d0230t1r01qt2u31n5vgd0230t1r01qt2u31n600";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = actions.map(async (symbol) => {
          const res = await axios.get("https://finnhub.io/api/v1/quote", {
            params: { symbol, token: apiKey }
          });

          return {
            symbol,
            price: res.data.c,
            variation: ((res.data.c - res.data.pc) / res.data.pc) * 100
          };
        });

        const results = await Promise.all(promises);
        setStocks(results);
        setLoading(false);
      } catch (error) {
        console.error("Erreur Finnhub :", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="bourse-loading">Chargement des données boursières...</p>;
  }

  return (
    <div className="bourse-container">
      <div className="bourse-card">
        <h2 className="bourse-title"> Cours de la Bourse</h2>
        <ul className="bourse-list">
          {stocks.map((stock) => (
            <li key={stock.symbol} className="bourse-item">
              <span className="bourse-symbol">{stock.symbol}</span>
              <span className={`bourse-price ${stock.variation >= 0 ? "up" : "down"}`}>
                {stock.price?.toFixed(2)} $ ({stock.variation?.toFixed(2)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bourse;
