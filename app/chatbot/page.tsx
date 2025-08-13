import React from "react"
import ChatBot from "@/components/chatbot"

export default function ChatbotPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Assistant IA</h1>
      <p className="text-slate-300 mb-8">Discutez avec l'assistant IA pour obtenir de l'aide sur la conformité fiscale.</p>
      <div className="w-full max-w-4xl">
        <ChatBot />
      </div>
    </div>
  )
} 