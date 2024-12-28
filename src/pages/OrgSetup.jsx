// src/pages/OrgSetup.js


export const OrgSetupPage = () => {
  const handleOrgSetup = async (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const websiteUrl = e.target.websiteUrl.value
    const slug = e.target.slug.value

    try {
      // await createOrganization({ name, websiteUrl, slug })
      window.location.href = '/dashboard'
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Organization Setup</h2>
      <form onSubmit={handleOrgSetup}>
        <input name="name" type="text" placeholder="Organization Name" required />
        <input name="websiteUrl" type="url" placeholder="Website URL" />
        <input name="slug" type="text" placeholder="Organization Slug" required />
        <button type="submit">Setup Organization</button>
      </form>
    </div>
  )
}
