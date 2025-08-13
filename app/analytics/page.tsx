"use client"

import React, { useEffect, useState } from "react";

interface PredictionHistory {
  date: string;
  prediction: number;
  probability: number;
  formData: any;
}

export default function AnalyticsPage() {
  const [history, setHistory] = useState<PredictionHistory[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("taxalert_predictions") || "[]");
    setHistory(data.reverse()); // plus récent en haut
  }, []);

  const total = history.length;
  const nonConformes = history.filter(h => h.prediction === 1).length;
  const conformes = total - nonConformes;
  const tauxNonConformes = total ? ((nonConformes / total) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Analytiques</h1>
      <p className="text-slate-300 mb-8">Statistiques dynamiques sur les prédictions réalisées.</p>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-2xl space-y-4">
        <div className="flex justify-between text-slate-200">
          <span>Total de prédictions :</span>
          <span>{total}</span>
        </div>
        <div className="flex justify-between text-green-400">
          <span>Conformes :</span>
          <span>{conformes}</span>
        </div>
        <div className="flex justify-between text-red-400">
          <span>Non-conformes :</span>
          <span>{nonConformes}</span>
        </div>
        <div className="flex justify-between text-blue-400">
          <span>Taux de non-conformité :</span>
          <span>{tauxNonConformes}%</span>
        </div>
        <hr className="my-4 border-slate-700" />
        <h2 className="text-xl font-semibold text-white mb-2">Historique des prédictions</h2>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <p className="text-slate-400 text-center">Aucune statistique disponible pour le moment.</p>
          ) : (
            history.map((h, idx) => (
              <div key={idx} className="flex justify-between text-slate-300 border-b border-slate-800 py-1">
                <span>{new Date(h.date).toLocaleString()}</span>
                <span className={h.prediction === 1 ? "text-red-400" : "text-green-400"}>
                  {h.prediction === 1 ? "Non-conforme" : "Conforme"}
                </span>
                <span>{(h.probability * 100).toFixed(1)}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 