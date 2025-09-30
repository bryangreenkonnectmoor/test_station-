'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { supabase, type Audience, type Concept } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Sparkles } from 'lucide-react'

interface ConceptGeneratorProps {
  audiences: Audience[]
  onConceptGenerated: (concept: Concept) => void
}

export default function ConceptGenerator({ audiences, onConceptGenerated }: ConceptGeneratorProps) {
  const [selectedAudienceId, setSelectedAudienceId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Auto-select if only one audience
  useEffect(() => {
    if (audiences.length === 1 && !selectedAudienceId) {
      setSelectedAudienceId(audiences[0].id)
    }
  }, [audiences, selectedAudienceId])

  const handleGenerateConcept = async () => {
    if (!selectedAudienceId) return

    setIsGenerating(true)

    try {
      const audience = audiences.find(a => a.id === selectedAudienceId)
      if (!audience) throw new Error('Audience not found')

      const response = await fetch('/api/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience }),
      })

      if (!response.ok) throw new Error('Failed to generate concept')

      const generatedConcept = await response.json()

      const { data, error } = await supabase
        .from('concepts')
        .insert({
          audience_id: selectedAudienceId,
          title: generatedConcept.title,
          description: generatedConcept.description,
          parent_concept_id: null,
        })
        .select('*, audience:audiences(*)')
        .single()

      if (error) throw error

      toast({
        title: 'Concept generated successfully',
        description: generatedConcept.title,
      })

      onConceptGenerated(data)
    } catch (error) {
      console.error('Error generating concept:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate concept. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Marketing Concept
        </CardTitle>
        <CardDescription>
          Select an audience to generate AI-powered marketing concepts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {audiences.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="audience-select">Select Audience</Label>
            <Select value={selectedAudienceId} onValueChange={setSelectedAudienceId}>
              <SelectTrigger id="audience-select">
                <SelectValue placeholder="Choose an audience" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map(audience => (
                  <SelectItem key={audience.id} value={audience.id}>
                    {audience.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {audiences.length === 1 && (
          <div className="space-y-2">
            <Label>Selected Audience</Label>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-medium">{audiences[0].name}</div>
              <div className="text-sm text-muted-foreground">
                {audiences[0].age_range} • {audiences[0].gender} • {audiences[0].location}
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleGenerateConcept} 
          disabled={!selectedAudienceId || isGenerating}
          className="w-full"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? 'Generating...' : 'Generate Concept'}
        </Button>
      </CardContent>
    </Card>
  )
}
