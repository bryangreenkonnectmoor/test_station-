'use client'

import { useEffect, useState } from 'react'
import AudienceManager from '@/components/AudienceManager'
import ConceptGenerator from '@/components/ConceptGenerator'
import ConceptList from '@/components/ConceptList'
import { supabase, type Audience, type Concept } from '@/lib/supabase'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null)

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

  const handleAudienceSelected = (audience: Audience) => {
    setSelectedAudience(audience)
  }

  const handleConceptGenerated = (concept: Concept) => {
    setConcepts(prev => [concept, ...prev])
  }

  const handleConceptUpdated = (updatedConcept: Concept) => {
    setConcepts(prev => 
      prev.map(concept => 
        concept.id === updatedConcept.id ? updatedConcept : concept
      )
    )
  }

  const handleConceptDeleted = (conceptId: string) => {
    setConcepts(prev => prev.filter(concept => concept.id !== conceptId))
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
          <div className="space-y-8">
            {/* Audience Manager */}
            <AudienceManager onAudienceSelected={handleAudienceSelected} />

            {/* Concept Generation */}
            {selectedAudience && (
              <div className="grid lg:grid-cols-2 gap-8">
                <ConceptGenerator
                  audiences={[selectedAudience]}
                  onConceptGenerated={handleConceptGenerated}
                />
                <ConceptList
                  concepts={concepts}
                  onConceptRemixed={handleConceptGenerated}
                  onConceptUpdated={handleConceptUpdated}
                  onConceptDeleted={handleConceptDeleted}
                />
              </div>
            )}

            {/* All Concepts View */}
            {!selectedAudience && concepts.length > 0 && (
              <ConceptList
                concepts={concepts}
                onConceptRemixed={handleConceptGenerated}
                onConceptUpdated={handleConceptUpdated}
                onConceptDeleted={handleConceptDeleted}
              />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
