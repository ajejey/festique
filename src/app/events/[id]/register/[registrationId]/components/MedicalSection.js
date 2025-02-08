'use client'

export default function MedicalSection({ register, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Medical Information</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Medical Conditions
          </label>
          <textarea
            {...register('registrationDetails.medicalInfo.medicalConditions')}
            placeholder="List any medical conditions (separated by commas)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Allergies
          </label>
          <textarea
            {...register('registrationDetails.medicalInfo.allergies')}
            placeholder="List any allergies (separated by commas)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Current Medications
          </label>
          <textarea
            {...register('registrationDetails.medicalInfo.medications')}
            placeholder="List any current medications (separated by commas)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Emergency Medical Notes
          </label>
          <textarea
            {...register('registrationDetails.medicalInfo.emergencyMedicalNotes')}
            placeholder="Any additional medical information that emergency responders should know"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
}
