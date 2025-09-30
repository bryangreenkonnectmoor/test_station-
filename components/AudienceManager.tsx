'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type Audience } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Edit, Trash2, Plus, X } from 'lucide-react'

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
const GENDERS = ['All', 'Male', 'Female', 'Non-binary', 'Prefer not to say']
const INCOME_LEVELS = ['Low (<$30k)', 'Lower-Middle ($30k-$50k)', 'Middle ($50k-$75k)', 'Upper-Middle ($75k-$100k)', 'High ($100k+)']
const INTEREST_OPTIONS = [
  'Technology', 'Fashion', 'Sports', 'Travel', 'Food & Dining',
  'Health & Fitness', 'Entertainment', 'Arts & Culture', 'Gaming',
  'Outdoor Activities', 'Home & Garden', 'Finance', 'Education'
]

interface AudienceManagerProps {
  onAudienceSelected: (audience: Audience) => void
}

export default function AudienceManager({ onAudienceSelected }: AudienceManagerProps) {
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    gender: '',
    location: '',
    interests: [] as string[],
    incomeLevel: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    loadAudiences()
  }, [])

  const loadAudiences = async () => {
    try {
      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAudiences(data || [])
    } catch (error) {
      console.error('Error loading audiences:', error)
      toast({
        title: 'Error',
        description: 'Failed to load audiences',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      ageRange: '',
      gender: '',
      location: '',
      interests: [],
      incomeLevel: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (audience: Audience) => {
    setFormData({
      name: audience.name,
      ageRange: audience.age_range,
      gender: audience.gender,
      location: audience.location,
      interests: audience.interests,
      incomeLevel: audience.income_level,
    })
    setEditingId(audience.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId) {
        // Update existing audience
        const { data, error } = await supabase
          .from('audiences')
          .update({
            name: formData.name,
            age_range: formData.ageRange,
            gender: formData.gender,
            location: formData.location,
            interests: formData.interests,
            income_level: formData.incomeLevel,
          })
          .eq('id', editingId)
          .select()
          .single()

        if (error) throw error

        toast({
          title: 'Audience updated successfully',
          description: `${formData.name} has been updated.`,
        })

        setAudiences(prev => prev.map(aud => aud.id === editingId ? data : aud))
      } else {
        // Create new audience
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
          description: `${formData.name} has been added.`,
        })

        setAudiences(prev => [data, ...prev])
      }

      resetForm()
    } catch (error) {
      console.error('Error saving audience:', error)
      toast({
        title: 'Error',
        description: 'Failed to save audience. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated concepts.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('audiences')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Audience deleted',
        description: `${name} has been deleted.`,
      })

      setAudiences(prev => prev.filter(aud => aud.id !== id))
    } catch (error) {
      console.error('Error deleting audience:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete audience. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const isFormValid = formData.name && formData.ageRange && formData.gender && 
                      formData.location && formData.interests.length > 0 && 
                      formData.incomeLevel

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading audiences...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audience Manager</h2>
          <p className="text-muted-foreground">Create, edit, and manage your target audiences</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Audience
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? 'Edit Audience' : 'Create New Audience'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
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

              <div className="flex gap-2">
                <Button type="submit" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? 'Update Audience' : 'Create Audience'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Audience List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Audiences ({audiences.length})</h3>
        
        {audiences.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No audiences created yet</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Audience
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {audiences.map(audience => (
              <Card key={audience.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl">{audience.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {audience.age_range} • {audience.gender} • {audience.location} • {audience.income_level}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {audience.interests.map(interest => (
                          <span
                            key={interest}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAudienceSelected(audience)}
                      >
                        Select
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(audience)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(audience.id, audience.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
