import React from "react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Paramètres</h1>
      <p className="text-slate-300 mb-8">Configurez ici les paramètres du système d'alerte fiscale.</p>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-2xl">
        <p className="text-slate-400 text-center">Aucun paramètre configurable pour le moment.</p>
      </div>
    </div>
  )
} 