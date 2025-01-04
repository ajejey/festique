import Modal from '@/components/Modal'
import LoginForm from '@/app/_components/LoginForm'

export default function LoginModal() {
  return (
    <Modal>
      <div className="p-6">
        <LoginForm />
      </div>
    </Modal>
  )
}
