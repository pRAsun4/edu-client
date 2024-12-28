import {
  getInvite,
  useQuery
} from 'wasp/client/operations'
import {
  SignupForm,
} from 'wasp/client/auth'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

export const InviteAcceptPage = () => {
  const { inviteToken } = useParams()
  const { data: invite, isLoading, isError } = useQuery(getInvite, { token: inviteToken })

  useEffect(() => {
    if (invite) {
      let emailInput = document.querySelector('input[name="email"]')
      emailInput.value = invite.email
      emailInput.readOnly = true
      emailInput.classList.add("disabledInput")
    }
  }, [invite])

  if (isLoading) { return <div>Loading invite...</div> }
  if (isError) { return <div>Error loading invite</div> }


  return (
    <section className='min-h-screen flex items-center justify-center'>
      <div className='container mx-auto'>
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <div>
            <h2 className='mb-3'>Complete Sign-Up process</h2>
            <p>Please fill the following fields to complete sign-up process</p>
          </div>
          <SignupForm />
          <br />
        </div>
      </div>
    </section>
  )
}
