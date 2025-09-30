'use client'

import { useEffect, useState } from 'react'
import AudienceForm from '@/components/AudienceForm'
import ConceptGenerator from '@/components/ConceptGenerator'
import ConceptList from '@/components/ConceptList'
import { supabase, type Audience, type Concept } from '@/lib/supabase'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [audiencesResponse, conceptsResponse] = await Promise.all([
        supabase.from('audiences').select('*').order('created_at', { ascending: false }),
        supabase.from('concepts').select('*, audience:audiences(*)').order('created_at', { ascending: false })
      ])

      if (audiencesResponse.data) setAudiences(audiencesResponse.data)
      if (conceptsResponse.data) setConcepts(conceptsResponse.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAudienceCreated = (audience: Audience) => {
    setAudiences(prev => [audience, ...prev])
  }

  const handleConceptGenerated = (concept: Concept) => {
    setConcepts(prev => [concept, ...prev])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Audience Concept Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create audience profiles and generate AI-powered marketing concepts tailored to your target demographics
          </p>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <AudienceForm onAudienceCreated={handleAudienceCreated} />
              
              {audiences.length > 0 && (
                <ConceptGenerator 
                  audiences={audiences} 
                  onConceptGenerated={handleConceptGenerated}
                />
              )}
            </div>

            <div className="lg:col-span-2">
              <ConceptList 
                concepts={concepts}
                onConceptRemixed={handleConceptGenerated}
              />
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built for Station Sciences · Powered by AI</p>
        </footer>
      </div>
    </main>
  )
}
