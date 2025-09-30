'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Concept } from '@/lib/supabase'
import { Calendar, Sparkles, Users, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface ConceptListProps {
  concepts: Concept[]
  onConceptRemixed: (concept: Concept) => void
}

export default function ConceptList({ concepts, onConceptRemixed }: ConceptListProps) {
  const [remixingId, setRemixingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRemix = async (concept: Concept) => {
    setRemixingId(concept.id)

    try {
      const response = await fetch('/api/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          audience: concept.audience,
          parentConcept: concept
        }),
      })

      if (!response.ok) throw new Error('Failed to remix concept')

      const remixedConcept = await response.json()

      const { data, error } = await supabase
        .from('concepts')
        .insert({
          audience_id: concept.audience_id,
          title: remixedConcept.title,
          description: remixedConcept.description,
          parent_concept_id: concept.id,
        })
        .select('*, audience:audiences(*)')
        .single()

      if (error) throw error

      toast({
        title: 'Concept remixed successfully',
        description: remixedConcept.title,
      })

      onConceptRemixed(data)
    } catch (error) {
      console.error('Error remixing concept:', error)
      toast({
        title: 'Error',
        description: 'Failed to remix concept. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setRemixingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (concepts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No concepts yet</h3>
            <p className="text-sm text-muted-foreground">
              Create an audience and generate your first marketing concept
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Generated Concepts</h2>
      <div className="grid gap-4">
        {concepts.map(concept => (
          <Card key={concept.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl">{concept.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {concept.audience?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(concept.created_at)}
                    </span>
                    {concept.parent_concept_id && (
                      <span className="flex items-center gap-1 text-primary">
                        <RefreshCw className="h-3 w-3" />
                        Remixed
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{concept.description}</p>
              
              {concept.audience && (
                <div className="bg-muted rounded-lg p-3 space-y-2 text-xs">
                  <div className="font-semibold">Target Audience Details:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-muted-foreground">Age:</span> {concept.audience.age_range}</div>
                    <div><span className="text-muted-foreground">Gender:</span> {concept.audience.gender}</div>
                    <div><span className="text-muted-foreground">Location:</span> {concept.audience.location}</div>
                    <div><span className="text-muted-foreground">Income:</span> {concept.audience.income_level}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interests:</span>{' '}
                    {concept.audience.interests.join(', ')}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemix(concept)}
                disabled={remixingId === concept.id}
                className="w-full"
              >
                {remixingId === concept.id ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Remixing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix This Concept
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
