"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, HelpCircle, AlertCircle, Trash2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "info" | "warning" | "success"
}

export default function ChatBot() {
  const initialWelcomeText =
    "Bonjour ! Je suis votre assistant IA spécialisé dans la Charte du Contribuable 2025 du Cameroun. Je peux vous aider à comprendre vos droits et obligations fiscales camerounaises. Posez-moi vos questions !"

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: initialWelcomeText,
      sender: "bot",
      timestamp: new Date(),
      type: "info",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "Quels sont mes droits lors d'un contrôle fiscal ?",
    "Comment contester une décision fiscale ?",
    "Quels sont les délais de prescription ?",
    "Comment faire un recours gracieux ?",
    "Quels sont mes droits en matière de secret professionnel ?",
    "Comment obtenir un délai de paiement ?"
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Appel à l'API Flask RAG
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "question": inputValue,
          "include_sources": false
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API')
      }

      const data = await response.json()
      
      // Créer la réponse du bot avec les sources seulement si nécessaire
      let botContent = data.answer
      
      // N'afficher les sources que si la réponse contient des informations techniques
      const isGreeting = data.answer.toLowerCase().includes('bonjour') && 
                        (data.answer.toLowerCase().includes('comment puis-je') || 
                         data.answer.toLowerCase().includes('que puis-je') ||
                         data.answer.toLowerCase().includes('comment vous aider'))
      
      const isTechnicalResponse = !isGreeting && (
        data.answer.toLowerCase().includes('charte') || 
        data.answer.toLowerCase().includes('fiscal') ||
        data.answer.toLowerCase().includes('droit') ||
        data.answer.toLowerCase().includes('tva') ||
        data.answer.toLowerCase().includes('impôt') ||
        data.answer.toLowerCase().includes('douane') ||
        data.answer.toLowerCase().includes('page') ||
        data.answer.toLowerCase().includes('sources')
      )
      
      if (data.sources && data.sources.length > 0 && isTechnicalResponse) {
        botContent += `\n\n📚 Sources : ${data.sources.join(', ')}`
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent,
        sender: "bot",
        timestamp: new Date(),
        type: "info",
      }
      
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Erreur:', error)
      
      // Message d'erreur en cas de problème
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, je ne peux pas répondre pour le moment. Veuillez vérifier que le serveur Flask est bien démarré sur le port 5000.",
        sender: "bot",
        timestamp: new Date(),
        type: "warning",
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateBotResponse = (input: string): { content: string; type?: "info" | "warning" | "success" } => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("score") || lowerInput.includes("conformité")) {
      return {
        content:
          "Le score de non-conformité est calculé par notre modèle RandomForest avec ADASYN. Un score ≥ 0.5 indique un risque élevé de non-conformité. Les facteurs principaux incluent les retards de paiement, les sanctions passées, et le ratio revenu/chiffre d'affaires.",
        type: "info",
      }
    }

    if (lowerInput.includes("alerte") || lowerInput.includes("conteste")) {
      return {
        content:
          "Si un contribuable conteste une alerte : 1) Vérifiez les données saisies, 2) Consultez l'historique des contrôles, 3) Proposez une révision manuelle, 4) Documentez la contestation dans le système.",
        type: "warning",
      }
    }

    if (lowerInput.includes("ajouter") || lowerInput.includes("nouveau")) {
      return {
        content:
          'Pour ajouter un nouveau contribuable : 1) Accédez à l\'onglet "Prédiction", 2) Remplissez tous les champs obligatoires, 3) Vérifiez les données, 4) Cliquez sur "Analyser et Prédire". Le système enregistrera automatiquement les informations.',
        type: "success",
      }
    }

    if (lowerInput.includes("seuil") || lowerInput.includes("risque")) {
      return {
        content:
          "Seuils de risque : Faible (0.0-0.3), Moyen (0.3-0.5), Élevé (0.5-1.0). Le seuil optimal pour déclencher une alerte est de 0.5, basé sur l'optimisation F1-score du modèle.",
        type: "info",
      }
    }

    if (lowerInput.includes("email") || lowerInput.includes("mail")) {
      return {
        content:
          "Les e-mails sont envoyés automatiquement aux contribuables avec un score ≥ 0.5. Le contenu est personnalisé selon les facteurs de risque détectés. Limite : 1 e-mail par mois par contribuable.",
        type: "info",
      }
    }

    if (lowerInput.includes("modèle") || lowerInput.includes("ia")) {
      return {
        content:
          "Notre modèle utilise RandomForestClassifier avec ADASYN, entraîné sur 60 000 contribuables. Métriques : F1-score > 0.8, Précision > 0.8, Rappel > 0.8. Le modèle est mis à jour mensuellement.",
        type: "success",
      }
    }

    return {
      content:
        "Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ou choisir une question suggérée ci-dessous ?",
      type: "warning",
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: initialWelcomeText,
        sender: "bot",
        timestamp: new Date(),
        type: "info",
      },
    ])
    setInputValue("")
    setIsTyping(false)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat principal */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-900 border-slate-800 h-[600px] flex flex-col">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bot className="h-5 w-5 text-blue-400" />
              <span>Assistant IA Fiscal Camerounais</span>
              <div className="ml-auto flex items-center space-x-2">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  En ligne
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={handleClearChat}
                  title="Effacer la discussion"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={`${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex-1 max-w-xs lg:max-w-md ${message.sender === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : message.type === "warning"
                              ? "bg-yellow-900/20 border border-yellow-800 text-yellow-200"
                              : message.type === "success"
                                ? "bg-green-900/20 border border-green-800 text-green-200"
                                : "bg-slate-800 text-slate-200"
                        }`}
                      >
                        {message.type && message.sender === "bot" && (
                          <div className="flex items-center space-x-1 mb-2">
                            {message.type === "warning" && <AlertCircle className="h-4 w-4" />}
                            {message.type === "success" && <Lightbulb className="h-4 w-4" />}
                            {message.type === "info" && <HelpCircle className="h-4 w-4" />}
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-800 text-slate-300">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-800 p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau latéral */}
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Questions Fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => handleQuickQuestion(question)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Aide Rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-200">Sujets disponibles :</h4>
              <div className="text-sm text-slate-400 space-y-1">
                <p>• Droits du contribuable</p>
                <p>• Contrôles fiscaux</p>
                <p>• Recours et contestations</p>
                <p>• Délais de prescription</p>
                <p>• Secret professionnel</p>
                <p>• Délais de paiement</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-200">Informations :</h4>
              <div className="text-sm text-slate-400 space-y-1">
                <p>• Basé sur la Charte 2025</p>
                <p>• Réponses documentées</p>
                <p>• Sources citées</p>
                <p>• Mise à jour régulière</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
