'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type Audience } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface AudienceFormProps {
  onAudienceCreated: (audience: Audience) => void
}

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
const GENDERS = ['All', 'Male', 'Female', 'Non-binary', 'Prefer not to say']
const INCOME_LEVELS = ['Low (<$30k)', 'Lower-Middle ($30k-$50k)', 'Middle ($50k-$75k)', 'Upper-Middle ($75k-$100k)', 'High ($100k+)']
const INTEREST_OPTIONS = [
  'Technology', 'Fashion', 'Sports', 'Travel', 'Food & Dining',
  'Health & Fitness', 'Entertainment', 'Arts & Culture', 'Gaming',
  'Outdoor Activities', 'Home & Garden', 'Finance', 'Education'
]

export default function AudienceForm({ onAudienceCreated }: AudienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    gender: '',
    location: '',
    interests: [] as string[],
    incomeLevel: '',
  })
  const { toast } = useToast()

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('audiences')
        .insert({
          name: formData.name,
          age_range: formData.ageRange,
          gender: formData.gender,
          location: formData.location,
          interests: formData.interests,
          income_level: formData.incomeLevel,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Audience created successfully',
        description: `${formData.name} has been added to your audiences.`,
      })

      setFormData({
        name: '',
        ageRange: '',
        gender: '',
        location: '',
        interests: [],
        incomeLevel: '',
      })

      onAudienceCreated(data)
    } catch (error) {
      console.error('Error creating audience:', error)
      toast({
        title: 'Error',
        description: 'Failed to create audience. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.ageRange && formData.gender && 
                      formData.location && formData.interests.length > 0 && 
                      formData.incomeLevel

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Audience</CardTitle>
        <CardDescription>
          Define your target audience with key demographics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Audience Name</Label>
            <Input
              id="name"
              placeholder="e.g., Tech-Savvy Millennials"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age-range">Age Range</Label>
              <Select value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
                <SelectTrigger id="age-range">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map(gender => (
                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Urban Northeast, USA"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Income Level</Label>
            <Select value={formData.incomeLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, incomeLevel: value }))}>
              <SelectTrigger id="income">
                <SelectValue placeholder="Select income level" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Interests (select multiple)</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Audience
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
