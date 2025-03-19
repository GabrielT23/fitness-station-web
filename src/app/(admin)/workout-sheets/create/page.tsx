'use client'

import { useCallback, useState } from 'react'
import { useWorkoutSheets } from '@/hooks/useWorkoutSheets'
import { useAuth } from '@/hooks/useAuth'
import { CreateWorkoutSheetRequest } from '@/services/workoutSheetService'
import { Select } from '@/components/inputs/Select'
import { Input } from '@/components/inputs/Input'
import { Button } from '@/components/buttons/Button'
import { console } from 'node:inspector'

interface ExerciseForm {
  name: string
  reps: number
  sets: number
  muscleGroup: string
  restPeriod: number
  videoLink?: string
}

interface WorkoutForm {
  name: string
  exercises: ExerciseForm[]
}

export default function CreateWorkoutSheetPage() {
  const { addSheet } = useWorkoutSheets()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<CreateWorkoutSheetRequest>({
    name: '',
    type: 'default',
    isActive: true,
    companyId: user?.companyId || '',
    workouts: []
  })

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await addSheet(formData)
      // Redirecionar ou mostrar sucesso
    } finally {
      setIsSubmitting(false)
    }
  }, [addSheet, formData])

  const addWorkout = () => {
    setFormData(prev => ({
      ...prev,
      workouts: [...prev.workouts || [], {
        name: '',
        exercises: []
      }]
    }))
  }

  const removeWorkout = (workoutIndex: number) => {
    setFormData(prev => ({
      ...prev,
      workouts: prev.workouts?.filter((_, index) => index !== workoutIndex) || []
    }))
  }

  const addExercise = (workoutIndex: number) => {
    setFormData(prev => {
      const newWorkouts = prev.workouts
        ? prev.workouts.map((workout, index) => {
            if (index === workoutIndex) {
              return {
                ...workout,
                exercises: [
                  ...workout.exercises,
                  {
                    name: '',
                    reps: 0,
                    sets: 0,
                    muscleGroup: '',
                    restPeriod: 0
                  }
                ]
              };
            }
            return workout;
          })
        : [];
      return { ...prev, workouts: newWorkouts };
    });
  };
  

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    setFormData(prev => {
      const newWorkouts = [...prev.workouts || []]
      newWorkouts[workoutIndex].exercises = newWorkouts[workoutIndex].exercises
        .filter((_, index) => index !== exerciseIndex)
      return { ...prev, workouts: newWorkouts }
    })
  }

  const updateWorkout = (workoutIndex: number, field: string, value: string) => {
    setFormData(prev => {
      const newWorkouts = [...prev.workouts || []]
      newWorkouts[workoutIndex] = { ...newWorkouts[workoutIndex], [field]: value }
      return { ...prev, workouts: newWorkouts }
    })
  }

  const updateExercise = (workoutIndex: number, exerciseIndex: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newWorkouts = [...prev.workouts || []]
      const exercises = [...newWorkouts[workoutIndex].exercises]
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: value }
      newWorkouts[workoutIndex].exercises = exercises
      return { ...prev, workouts: newWorkouts }
    })
  }


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Criar Nova Ficha de Treino </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome da Ficha"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Select
            label="Tipo de Treino"
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'default', label: 'Padrão' },
              { value: 'custom', label: 'Personalizada' },
            ]}
          />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
            <label>Ficha Ativa</label>
          </div>
        </div>

        <div className="space-y-4">
          {formData.workouts?.map((workout, workoutIndex) => (
            <div key={workoutIndex} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Treino {workoutIndex + 1}</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addExercise(workoutIndex)}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Adicionar Exercício
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWorkout(workoutIndex)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remover Treino
                  </button>
                </div>
              </div>

              <Input
                label="Nome do Treino"
                value={workout.name}
                onChange={e => updateWorkout(workoutIndex, 'name', e.target.value)}
                required
              />

              {workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="ml-4 p-4 border rounded mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Exercício {exerciseIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeExercise(workoutIndex, exerciseIndex)}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remover Exercício
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome do Exercício"
                      value={exercise.name}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'name', e.target.value)}
                      required
                    />
                    <Input
                      label="Grupo Muscular"
                      value={exercise.muscleGroup}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'muscleGroup', e.target.value)}
                      required
                    />
                    <Input
                      label="Séries"
                      type="number"
                      value={exercise.sets}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'sets', Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Repetições"
                      type="number"
                      value={exercise.reps}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'reps', Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Descanso (segundos)"
                      type="number"
                      value={exercise.restPeriod}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'restPeriod', Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Link do Vídeo (opcional)"
                      value={exercise.videoLink || ''}
                      onChange={e => updateExercise(workoutIndex, exerciseIndex, 'videoLink', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={addWorkout}
            variant="secondary"
            className="w-full"
          >
            Adicionar Novo Treino
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Ficha de Treino'}
          </Button>
        </div>
      </form>
    </div>
  )
}