// 'use client'

// import { useCallback, useState } from 'react'
// import { useWorkoutSheets } from '@/hooks/useWorkoutSheets'
// import { useAuth } from '@/hooks/useAuth'
// import { CreateWorkoutSheetRequest } from '@/services/workoutSheetService'
// import { Select } from '@/components/inputs/Select'
// import { Input } from '@/components/inputs/Input'
// import { Button } from '@/components/buttons/Button'



// export default function CreateWorkoutSheetPage() {
//   const { addSheet } = useWorkoutSheets()
//   const { user } = useAuth()
//   const [isSubmitting, setIsSubmitting] = useState(false)
  
//   const [formData, setFormData] = useState<CreateWorkoutSheetRequest>({
//     name: '',
//     type: 'default',
//     isActive: true,
//     companyId: user?.companyId || '',
//     workouts: []
//   })

//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     try {
//       await addSheet(formData)
//       // Redirecionar ou mostrar sucesso
//     } finally {
//       setIsSubmitting(false)
//     }
//   }, [addSheet, formData])

//   const addWorkout = () => {
//     setFormData(prev => ({
//       ...prev,
//       workouts: [...prev.workouts || [], {
//         name: '',
//         exercises: []
//       }]
//     }))
//   }

//   const removeWorkout = (workoutIndex: number) => {
//     setFormData(prev => ({
//       ...prev,
//       workouts: prev.workouts?.filter((_, index) => index !== workoutIndex) || []
//     }))
//   }

//   const addExercise = (workoutIndex: number) => {
//     setFormData(prev => {
//       const newWorkouts = prev.workouts
//         ? prev.workouts.map((workout, index) => {
//             if (index === workoutIndex) {
//               return {
//                 ...workout,
//                 exercises: [
//                   ...workout.exercises,
//                   {
//                     name: '',
//                     reps: 0,
//                     sets: 0,
//                     muscleGroup: '',
//                     restPeriod: 0
//                   }
//                 ]
//               };
//             }
//             return workout;
//           })
//         : [];
//       return { ...prev, workouts: newWorkouts };
//     });
//   };
  

//   const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
//     setFormData(prev => {
//       const newWorkouts = [...prev.workouts || []]
//       newWorkouts[workoutIndex].exercises = newWorkouts[workoutIndex].exercises
//         .filter((_, index) => index !== exerciseIndex)
//       return { ...prev, workouts: newWorkouts }
//     })
//   }

//   const updateWorkout = (workoutIndex: number, field: string, value: string) => {
//     setFormData(prev => {
//       const newWorkouts = [...prev.workouts || []]
//       newWorkouts[workoutIndex] = { ...newWorkouts[workoutIndex], [field]: value }
//       return { ...prev, workouts: newWorkouts }
//     })
//   }

//   const updateExercise = (workoutIndex: number, exerciseIndex: number, field: string, value: string | number) => {
//     setFormData(prev => {
//       const newWorkouts = [...prev.workouts || []]
//       const exercises = [...newWorkouts[workoutIndex].exercises]
//       exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: value }
//       newWorkouts[workoutIndex].exercises = exercises
//       return { ...prev, workouts: newWorkouts }
//     })
//   }


//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Criar Nova Ficha de Treino </h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Nome da Ficha"
//             value={formData.name}
//             onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
//             required
//           />
          
//           <Select
//             label="Tipo de Treino"
//             value={formData.type}
//             onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
//             options={[
//               { value: 'default', label: 'Padrão' },
//               { value: 'custom', label: 'Personalizada' },
//             ]}
//           />
          
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
//               className="h-4 w-4"
//             />
//             <label>Ficha Ativa</label>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {formData.workouts?.map((workout, workoutIndex) => (
//             <div key={workoutIndex} className="p-4 border rounded-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Treino {workoutIndex + 1}</h2>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => addExercise(workoutIndex)}
//                     className="text-sm bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     Adicionar Exercício
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => removeWorkout(workoutIndex)}
//                     className="text-sm bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Remover Treino
//                   </button>
//                 </div>
//               </div>

//               <Input
//                 label="Nome do Treino"
//                 value={workout.name}
//                 onChange={e => updateWorkout(workoutIndex, 'name', e.target.value)}
//                 required
//               />

//               {workout.exercises.map((exercise, exerciseIndex) => (
//                 <div key={exerciseIndex} className="ml-4 p-4 border rounded mt-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-medium">Exercício {exerciseIndex + 1}</h3>
//                     <button
//                       type="button"
//                       onClick={() => removeExercise(workoutIndex, exerciseIndex)}
//                       className="text-sm bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                       Remover Exercício
//                     </button>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       label="Nome do Exercício"
//                       value={exercise.name}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'name', e.target.value)}
//                       required
//                     />
//                     <Select
//                       label="Grupo Muscular"
//                       value={exercise.muscleGroup}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'muscleGroup', e.target.value)}
//                       options={[
//                         { value: 'CHEST', label: 'Peito' },
//                         { value: 'BACK', label: 'Costas' },
//                         { value: 'LEGS', label: 'Pernas' },
//                         { value: 'SHOULDERS', label: 'Ombros' },
//                         { value: 'ARMS', label: 'Braços' },
//                         { value: 'CORE', label: 'Core' },
//                       ]}
//                       required
//                     />
//                     <Input
//                       label="Séries"
//                       type="number"
//                       value={exercise.sets}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'sets', Number(e.target.value))}
//                       required
//                     />
//                     <Input
//                       label="Repetições"
//                       type="number"
//                       value={exercise.reps}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'reps', Number(e.target.value))}
//                       required
//                     />
//                     <Input
//                       label="Descanso (segundos)"
//                       type="number"
//                       value={exercise.restPeriod}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'restPeriod', Number(e.target.value))}
//                       required
//                     />
//                     <Input
//                       label="Link do Vídeo (opcional)"
//                       value={exercise.videoLink || ''}
//                       onChange={e => updateExercise(workoutIndex, exerciseIndex, 'videoLink', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div className="flex flex-col gap-4">
//           <Button
//             type="button"
//             onClick={addWorkout}
//             variant="secondary"
//             className="w-full"
//           >
//             Adicionar Novo Treino
//           </Button>

//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700"
//           >
//             {isSubmitting ? 'Salvando...' : 'Salvar Ficha de Treino'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }

"use client";

import React from "react";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { useWorkoutSheets } from "@/hooks/useWorkoutSheets";
import { useAuth } from "@/hooks/useAuth";
import { CreateWorkoutSheetRequest } from "@/services/workoutSheetService";
import { Input } from "@/components/inputs/InputFormCreateWorkout";
import { Select } from "@/components/inputs/SelectFormCreateWorkout";
import { Button } from "@/components/buttons/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = CreateWorkoutSheetRequest;

const muscleOptions = [
  { value: "CHEST", label: "Peito" },
  { value: "BACK", label: "Costas" },
  { value: "LEGS", label: "Pernas" },
  { value: "SHOULDERS", label: "Ombros" },
  { value: "ARMS", label: "Braços" },
  { value: "CORE", label: "Core" },
];

/**
 * Componente principal - usa useFieldArray para `workouts`.
 * Cada WorkoutItem usa seu próprio useFieldArray para `workouts.${index}.exercises`
 */
export default function CreateWorkoutSheetPageRHForm() {
  const { addSheet } = useWorkoutSheets();
  const { user } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "default",
      isActive: true,
      companyId: user?.companyId || "",
      workouts: [],
    },
    mode: "onBlur",
  });

  const {
    fields: workouts,
    append: appendWorkout,
    remove: removeWorkout,
  } = useFieldArray({
    control,
    name: "workouts",
  });

  async function onSubmit(data: FormValues) {
    if (!data.companyId && user?.companyId) data.companyId = user.companyId;
    try {
      await addSheet(data);
      toast.success("Ficha criada com sucesso!");
      reset({
        name: "",
        type: "default",
        isActive: true,
        companyId: user?.companyId || "",
        workouts: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar ficha.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-50 flex items-start justify-center p-6">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          Criar Nova Ficha de Treino
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nome da Ficha"
                {...register("name", { required: "Nome da ficha é obrigatório" })}
                className={errors.name ? "border-red-500" : ""}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Select
                label="Tipo de Treino"
                {...register("type", { required: "Tipo é obrigatório" })}
                options={[
                  { value: "default", label: "Padrão" },
                  { value: "custom", label: "Personalizada" },
                ]}
                className={errors.type ? "border-red-500" : ""}
                aria-invalid={errors.type ? "true" : "false"}
              />
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 text-pink-600"
                id="isActive"
              />
              <label htmlFor="isActive" className="font-medium text-gray-700">
                Ficha Ativa
              </label>
            </div>
          </div>

          {/* Workouts list */}
          <div className="space-y-6">
            {workouts.map((w, index) => (
              <WorkoutItem
                key={w.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                removeWorkout={() => removeWorkout(index)}
              />
            ))}

            <div>
              <Button
                type="button"
                onClick={() =>
                  appendWorkout({
                    name: "",
                    exercises: [{ name: "", reps: 1, sets: 1, muscleGroup: "CHEST", restPeriod: 30, videoLink: "" }],
                  })
                }
                variant="secondary"
                className="w-full"
              >
                + Adicionar Novo Treino
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-pink-600 text-white">
              {isSubmitting ? "Salvando..." : "Salvar Ficha de Treino"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * WorkoutItem - componente filho que gerencia seu próprio useFieldArray de exercises.
 * Recebe index, control e register do pai.
 */
function WorkoutItem({
  index,
  control,
  register,
  errors,
  removeWorkout,
}: {
  index: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  removeWorkout: () => void;
}) {
  const { fields: exercises, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: `workouts.${index}.exercises` as const,
  });

  return (
    <div className="bg-pink-50 p-4 rounded-xl shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-pink-600">Treino {index + 1}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => appendExercise({ name: "", reps: 1, sets: 1, muscleGroup: "CHEST", restPeriod: 30, videoLink: "" })}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded"
          >
            Adicionar Exercício
          </button>
          <button type="button" onClick={removeWorkout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
            Remover Treino
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Nome do Treino"
            {...register(`workouts.${index}.name` as const, { required: "Nome do treino é obrigatório" })}
            className={errors.workouts?.[index]?.name ? "border-red-500" : ""}
            aria-invalid={errors.workouts?.[index]?.name ? "true" : "false"}
          />
          {errors.workouts?.[index]?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.name!.message}</p>
          )}
        </div>
      </div>

      {/* Exercises list */}
      <div className="mt-4 space-y-4">
        {exercises.map((ex, ei) => (
          <div key={ex.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Exercício {ei + 1}</h3>
              <button type="button" onClick={() => removeExercise(ei)} className="text-red-500">
                Remover
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <Input
                  label="Nome do Exercício"
                  {...register(`workouts.${index}.exercises.${ei}.name` as const, {
                    required: "Nome do exercício é obrigatório",
                  })}
                  className={errors.workouts?.[index]?.exercises?.[ei]?.name ? "border-red-500" : ""}
                />
                {errors.workouts?.[index]?.exercises?.[ei]?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.exercises![ei]!.name!.message}</p>
                )}
              </div>

              {/* Muscle Group */}
              <div>
                <Select
                  label="Grupo Muscular"
                  {...register(`workouts.${index}.exercises.${ei}.muscleGroup` as const, {
                    required: "Grupo muscular obrigatório",
                  })}
                  options={muscleOptions}
                  className={errors.workouts?.[index]?.exercises?.[ei]?.muscleGroup ? "border-red-500" : ""}
                />
                {errors.workouts?.[index]?.exercises?.[ei]?.muscleGroup && (
                  <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.exercises![ei]!.muscleGroup!.message}</p>
                )}
              </div>

              {/* Sets */}
              <div>
                <Input
                  label="Séries"
                  type="number"
                  {...register(`workouts.${index}.exercises.${ei}.sets` as const, {
                    required: "Séries obrigatórias",
                    valueAsNumber: true,
                    min: { value: 1, message: "Séries deve ser >= 1" },
                  })}
                  className={errors.workouts?.[index]?.exercises?.[ei]?.sets ? "border-red-500" : ""}
                />
                {errors.workouts?.[index]?.exercises?.[ei]?.sets && (
                  <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.exercises![ei]!.sets!.message}</p>
                )}
              </div>

              {/* Reps */}
              <div>
                <Input
                  label="Repetições"
                  type="number"
                  {...register(`workouts.${index}.exercises.${ei}.reps` as const, {
                    required: "Repetições obrigatórias",
                    valueAsNumber: true,
                    min: { value: 1, message: "Repetições deve ser >= 1" },
                  })}
                  className={errors.workouts?.[index]?.exercises?.[ei]?.reps ? "border-red-500" : ""}
                />
                {errors.workouts?.[index]?.exercises?.[ei]?.reps && (
                  <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.exercises![ei]!.reps!.message}</p>
                )}
              </div>

              {/* Rest */}
              <div>
                <Input
                  label="Descanso (segundos)"
                  type="number"
                  {...register(`workouts.${index}.exercises.${ei}.restPeriod` as const, {
                    required: "Tempo de descanso obrigatório",
                    valueAsNumber: true,
                    min: { value: 0, message: "Descanso inválido" },
                  })}
                  className={errors.workouts?.[index]?.exercises?.[ei]?.restPeriod ? "border-red-500" : ""}
                />
                {errors.workouts?.[index]?.exercises?.[ei]?.restPeriod && (
                  <p className="text-red-500 text-sm mt-1">{errors.workouts![index]!.exercises![ei]!.restPeriod!.message}</p>
                )}
              </div>

              {/* Video (opcional) */}
              <div className="md:col-span-2">
                <Input label="Link do Vídeo (opcional)" {...register(`workouts.${index}.exercises.${ei}.videoLink` as const)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

