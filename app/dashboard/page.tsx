"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, AlertTriangle, CheckCircle, Mail, TrendingUp, BarChart3, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ChatBot from "@/components/chatbot"

interface ContribuableData {
  revenu_annuel: number
  retards_paiement: number
  sanctions_passees: number
  chiffre_affaire: number
  secteur_activite: string
  localisation: string
  nb_controles: number
  niveau_risque: string
  email: string
}

interface PredictionResult {
  prediction: number
  probability: number
  recommendations: string[]
}

export default function Dashboard() {
  const [formData, setFormData] = useState<ContribuableData>({
    revenu_annuel: 40000000,
    retards_paiement: 1,
    sanctions_passees: 0,
    chiffre_affaire: 80000000,
    secteur_activite: "",
    localisation: "",
    nb_controles: 1,
    niveau_risque: "",
    email: "",
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revenu_annuel: formData.revenu_annuel,
          retards_paiement: formData.retards_paiement,
          sanctions_passées: formData.sanctions_passees,
          secteur_activité: formData.secteur_activite,
          chiffre_affaire: formData.chiffre_affaire,
          localisation: formData.localisation,
          nb_controles: formData.nb_controles,
          niveau_risque: formData.niveau_risque
        })
      })

      if (!response.ok) throw new Error("Erreur lors de la prédiction")

      const data = await response.json()
      const recommendations = []
      if (formData.retards_paiement > 0) {
        recommendations.push(`Vous avez ${formData.retards_paiement} retard(s) de paiement. Veuillez régulariser.`)
      }
      if (formData.sanctions_passees > 0) {
        recommendations.push(`${formData.sanctions_passees} sanction(s) passée(s) détectée(s).`)
      }
      if (formData.niveau_risque === "Élevé") {
        recommendations.push("Niveau de risque élevé détecté. Vérification recommandée.")
      }
      setPrediction({
        prediction: data.prediction,
        probability: data.probability,
        recommendations,
      })
      // Sauvegarde la prédiction dans le localStorage pour les analytiques
      const history = JSON.parse(localStorage.getItem("taxalert_predictions") || "[]");
      history.push({
        date: new Date().toISOString(),
        prediction: data.prediction,
        probability: data.probability,
        formData
      });
      localStorage.setItem("taxalert_predictions", JSON.stringify(history));
    } catch (error: any) {
      alert("Erreur lors de la prédiction : " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!formData.email) return;
    setEmailSent(true);
    const subject = "Alerte de non-conformité fiscale";
    const body = `Bonjour,\n\nSuite à l'analyse de votre dossier fiscal, notre système a détecté une situation de non-conformité. Nous vous invitons à régulariser votre situation dans les plus brefs délais afin d'éviter toute sanction ou pénalité conformément à la législation en vigueur.\n\nPour toute question ou assistance, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe TaxAlert`;
    try {
      const response = await fetch("http://localhost:5000/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          subject,
          body,
        }),
      });
      
      if (!response.ok) throw new Error("Erreur lors de l'envoi de l'e-mail");
      
      // Sauvegarder l'e-mail envoyé dans le localStorage
      const emailsSent = JSON.parse(localStorage.getItem("taxalert_emails_sent") || "[]");
      emailsSent.push({
        date: new Date().toISOString(),
        email: formData.email,
        subject,
        body
      });
      localStorage.setItem("taxalert_emails_sent", JSON.stringify(emailsSent));
    } catch (error: any) {
      alert("Erreur lors de l'envoi de l'e-mail : " + error.message);
    } finally {
      setTimeout(() => setEmailSent(false), 3000);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>
            <p className="text-slate-400">Système d'alerte proactive pour contribuables</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-600 text-green-400">
              Modèle: RandomForest
            </Badge>
            <Badge variant="outline" className="border-blue-600 text-blue-400">
              F1-Score: 0.85
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="prediction" className="space-y-6">
          <TabsList className="bg-slate-900 border-slate-800">
            <TabsTrigger value="prediction" className="data-[state=active]:bg-slate-800">
              <User className="h-4 w-4 mr-2" />
              Prédiction
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-slate-800">
              <MessageSquare className="h-4 w-4 mr-2" />
              Assistant IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Formulaire de saisie */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Données du Contribuable</CardTitle>
                  <CardDescription className="text-slate-400">
                    Saisissez les informations fiscales pour la prédiction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Revenu Annuel (FCFA)</Label>
                        <Input
                          type="number"
                          value={formData.revenu_annuel}
                          onChange={(e) => setFormData((prev) => ({ ...prev, revenu_annuel: Number(e.target.value) }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Chiffre d'Affaire (FCFA)</Label>
                        <Input
                          type="number"
                          value={formData.chiffre_affaire}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, chiffre_affaire: Number(e.target.value) }))
                          }
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Retards de Paiement</Label>
                        <Input
                          type="number"
                          value={formData.retards_paiement}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, retards_paiement: Number(e.target.value) }))
                          }
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Sanctions Passées</Label>
                        <Input
                          type="number"
                          value={formData.sanctions_passees}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, sanctions_passees: Number(e.target.value) }))
                          }
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Secteur d'Activité</Label>
                      <Select
                        value={formData.secteur_activite}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, secteur_activite: value }))}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Commerce">Commerce</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Industrie">Industrie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Localisation</Label>
                      <Select
                        value={formData.localisation}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, localisation: value }))}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                          <SelectItem value="Douala">Douala</SelectItem>
                          <SelectItem value="Bamenda">Bamenda</SelectItem>
                          <SelectItem value="Garoua">Garoua</SelectItem>
                          <SelectItem value="Buea">Buea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Nombre de Contrôles</Label>
                        <Input
                          type="number"
                          value={formData.nb_controles}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nb_controles: Number(e.target.value) }))}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Niveau de Risque</Label>
                        <Select
                          value={formData.niveau_risque}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, niveau_risque: value }))}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Niveau de risque" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="Faible">Faible</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Élevé">Élevé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">E-mail du Contribuable</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="contribuable@example.com"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Analyse en cours..." : "Analyser et Prédire"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Résultats de prédiction */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Résultats de l'Analyse</CardTitle>
                  <CardDescription className="text-slate-400">Prédiction de conformité fiscale</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-slate-400">Analyse des données...</span>
                      </div>
                      <Progress value={60} className="bg-slate-800" />
                    </div>
                  ) : prediction ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div
                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                            prediction.prediction === 1
                              ? "bg-red-900/20 border border-red-800"
                              : "bg-green-900/20 border border-green-800"
                          }`}
                        >
                          {prediction.prediction === 1 ? (
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                          <span
                            className={`font-semibold ${
                              prediction.prediction === 1 ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {prediction.prediction === 1 ? "Non-Conforme" : "Conforme"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Probabilité de non-conformité</span>
                          <span className="font-bold text-white">{(prediction.probability * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={prediction.probability * 100} className="bg-slate-800" />
                      </div>

                      {prediction.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Recommandations</h4>
                          <div className="space-y-2">
                            {prediction.recommendations.map((rec, index) => (
                              <Alert key={index} className="bg-yellow-900/20 border-yellow-800">
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                <AlertDescription className="text-yellow-200">{rec}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}

                      {prediction && prediction.prediction === 1 && formData.email && (
                        <div className="space-y-4">
                          <Button
                            onClick={handleSendEmail}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={emailSent}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            {emailSent ? "E-mail envoyé !" : "Envoyer Alerte E-mail"}
                          </Button>
                          {emailSent && (
                            <Alert className="bg-green-900/20 border-green-800">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <AlertDescription className="text-green-200">
                                E-mail d'alerte envoyé à {formData.email}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Remplissez le formulaire pour obtenir une prédiction</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbot">
            <ChatBot />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
