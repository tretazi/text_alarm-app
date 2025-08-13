"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Users, BarChart3, Mail, MessageSquare, Menu, X, Bell, Shield } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Tableau de Bord", href: "/dashboard", icon: Home, current: true },
    { name: "Historique", href: "/history", icon: Users, current: false },
    { name: "Analytiques", href: "/analytics", icon: BarChart3, current: false },
    { name: "E-mails", href: "/emails", icon: Mail, current: false },
    { name: "Assistant IA", href: "/chatbot", icon: MessageSquare, current: false },
    // Onglet Configuration supprimé
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="px-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
          <div className="flex items-center space-x-3 p-6 border-b border-slate-800">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TaxAlert</h1>
              <p className="text-xs text-slate-400">Système Proactif</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Modèle IA</p>
                <p className="text-xs text-slate-400">RandomForest actif</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Système Opérationnel
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
