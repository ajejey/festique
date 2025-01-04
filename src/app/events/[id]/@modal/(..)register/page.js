import { RegistrationForm } from '../../_components/RegistrationForm'
import Modal from '@/components/Modal'

export default function InterceptedRegisterModal() {
  return (
    <Modal>
      <div className="p-6">
        <h2 className="font-playfair text-2xl font-bold mb-6">Event Registration</h2>
        <RegistrationForm />
      </div>
    </Modal>
  )
}
