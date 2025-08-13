import React from "react"

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Historique des alertes</h1>
      <p className="text-slate-300 mb-8">Consultez ici l'historique des alertes fiscales générées par le système.</p>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-2xl">
        <p className="text-slate-400 text-center">Aucune donnée historique disponible pour le moment.</p>
      </div>
    </div>
  )
} 