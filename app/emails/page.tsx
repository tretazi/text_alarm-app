"use client"
import React, { useEffect, useState } from "react";

interface EmailSent {
  date: string;
  email: string;
  subject: string;
  body: string;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailSent[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("taxalert_emails_sent") || "[]");
    setEmails(data.reverse()); // plus récent en haut
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Gestion des E-mails</h1>
      <p className="text-slate-300 mb-8">Gérez ici l'envoi et l'historique des e-mails d'alerte fiscale.</p>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-2xl">
        {emails.length === 0 ? (
          <p className="text-slate-400 text-center">Aucun e-mail envoyé pour le moment.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {emails.map((mail, idx) => (
              <div key={idx} className="border-b border-slate-800 pb-2 mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{new Date(mail.date).toLocaleString()}</span>
                  <span>{mail.email}</span>
                </div>
                <div className="font-semibold text-slate-200">{mail.subject}</div>
                <div className="text-slate-300 text-sm mt-1 whitespace-pre-line">
                  {mail.body.length > 120 ? mail.body.slice(0, 120) + "..." : mail.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 