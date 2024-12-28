import {
  getReviewPages,
  createReviewPage,
  updateReviewPage,
  deleteReviewPage,
  useQuery,
  getLocation,
} from "wasp/client/operations";
import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { Modal } from "../components/Modal/Modal";
import { ListItem } from "../components/Settings/ListItem";
import { ConfirmDeleteModal } from "../components/Modal/ConfirmDeleteModal";
import { FormInput } from "../components/Form/FormInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextEditor } from "../components/TextEditor";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPencilLine } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { IoEyeOutline, IoCopyOutline } from "react-icons/io5";
import AddReview from "../assets/svg/AddReview";
import RightLogo from "../assets/svg/RightLogo";
import { useDispatch } from "react-redux";
import { setReviewFormData, setReviewLocationData } from "../features/appSlice";
import { getPaginatedData } from "../utils/Functions";
// import { getPaginatedData } from "../utils/Functions";

export const ReviewPages = ({ user }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    data: reviewPages,
    isLoading,
    isError,
    refetch
  } = useQuery(getReviewPages, {
    organizationId: user.organizationId
  })
  const { data: showLocation } = useQuery(getLocation)
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    location: '',
    buttonLabel: ''
  })

  const [currentEditId, setCurrentEditId] = useState(null)
  const [pageToDelete, setPageToDelete] = useState(null)
  const [copy, setCopy] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLocation, setCurrentLocation] = useState()
  const itemsPerPage = 5



  const { paginatedData, totalPages, hasNextPage, hasPreviousPage,  startIndex, endIndex } =
    getPaginatedData(reviewPages, currentPage, itemsPerPage);

  if (user.role != 'ORG_ADMIN') {
    navigate('/')
  }

  const handleAddOptions = e => {
    const selectedLocation = e.target.value
    setFormData(prevState => ({
      ...prevState,
      locations: selectedLocation
    }))
    setCurrentLocation(selectedLocation)
  }

  // Handle adding or editing a review page
  const handleSave = async e => {
    e.preventDefault()
    if (isEditMode) {
      await updateReviewPage({ id: currentEditId, ...formData })
    } else {
      await createReviewPage({
        ...formData,
        organizationId: user.organizationId
      })
    }
    refetch()
    resetModal()
  }

  // Reset modal and form state
  const resetModal = () => {
    setModalOpen(false)
    setIsEditMode(false)
    setFormData({ title: '', body: '', buttonLabel: '' })
    setCurrentEditId(null)
  }

  // Handle delete confirmation modal
  const confirmDelete = page => {
    setPageToDelete(page)
    setDeleteModalOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (pageToDelete) {
      await deleteReviewPage({ id: pageToDelete.id })
      refetch()
      setDeleteModalOpen(false)
      setPageToDelete(null)
    }
  }

  const handleCopy = (id, locationName) => {
    const url = `${baseUrl}/review-pages/${id}?location=${encodeURIComponent(
      locationName
    )}`

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopy(id);
        setTimeout(() => setCopy(null), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err))
  }

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }

  if (isLoading) {
    return (
      <InnerLayout Nav={SettingsNav}>
        <div>Loading pages...</div>
      </InnerLayout>
    )
  }

  if (isError) {
    return (
      <InnerLayout Nav={SettingsNav}>
        <div>Error loading pages</div>
      </InnerLayout>
    )
  }

  return (
    <InnerLayout childHeader='Review Pages' ChildIcon={FaStar}>
      <div className=' max-w-full sm:max-w-[1200px] w-full flex flex-col p-6 '>
        <div className='page__header w-full'>
          <h4 className='h4'>Review Pages</h4>
          {reviewPages && reviewPages.length > 0 ? (
            <button
              className='btn btn-primary'
              onClick={() => {
                setModalOpen(true)
                setIsEditMode(false)
              }}
            >
              Add Review Page
            </button>
          ) : null}
        </div>
        {paginatedData && paginatedData.length > 0 ? (
          <>
            <ul className="!mt-4 w-full flex flex-col sm:p-6 p-5 md:p-8 table_ul">
              {paginatedData.map((page) => (
                <ListItem
                  key={page.id}
                  className='md:flex-row flex-col items-start '
                >
                  <div className='flex flex-col relative'>
                    <div className='text-url flex w-auto gap-2 items-center'>
                      <h5 className='h5 !font-medium text-gray-900'>
                        {page.title}
                      </h5>
                    </div>
                    <div
                      className='content'
                      dangerouslySetInnerHTML={{
                        __html: page.body.substring(0, 40)
                      }}
                    />
                  </div>
                  <div className='flex items-center gap-3 flex-wrap sm:gap-5'>
                    <button
                      className={`btn btn-outline w-[133px] `}
                      title='copy to clipboard'
                      onClick={() =>
                        handleCopy(
                          page.id,
                          page.locations[0]?.name || 'Unknown Location'
                        )
                      }
                    >
                      <IoCopyOutline size={24} />
                      {copy === page.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <Link
                      to={`/review-pages/${page.id}` + (page.location ? `?location=${encodeURIComponent(page.location.name)}`: '') }
                      target="blank"
                      onClick={() => {
                        dispatch(
                          setReviewLocationData({
                            location: encodeURIComponent(page.location.name),
                            locationId: page.location.id,
                          })
                        )
                      }}
                      className='heading__link flex btn btn-outline !min-w-[44px] !max-h-[44px] hover-btn-bg'
                    >
                      <IoEyeOutline size={24} />
                    </Link>

                    <Link
                      to={`/review-pages/settings/${page.id}`}
                      className='flex btn btn-outline !min-w-[44px] !max-h-[44px] hover-btn-bg'
                      onClick={() => {
                        dispatch(
                          setReviewFormData({
                            title: page.title,
                            body: page.body,
                            buttonLabel: page.buttonLabel
                          })
                        )
                      }}
                    >
                      <LuPencilLine size={24} />
                    </Link>
                    <button
                      className='flex btn btn-outline !min-w-[44px] !max-h-[44px] tomato-btn-bg'
                      onClick={() => confirmDelete(page)}
                    >
                      <RiDeleteBin6Line size={24} />
                    </button>
                  </div>
                </ListItem>
              ))}
            </ul>
            {/* Pagination Controls */}
            
              <div className="pagination-controls w-full flex items-center justify-end mt-4 gap-3">
                <p className=" tracking-[0.32px] font-normal ">
                Page {currentPage} of {totalPages}
                </p>
                <div className="w-full flex items-center px-3 py-3 max-w-[5.625rem] justify-between rounded-md border ">
                  <button
                    className={` min-h-fit ${
                      currentPage === 1 ? "" : "cursor-pointer"
                    }  `}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <span className=" rotate-90 ">
                      {" "}
                      <RightLogo />{" "}
                    </span>
                  </button>
                  <button
                    className={` min-h-fit ${
                      endIndex >= reviewPages.length ? "" : "cursor-pointer"
                    }  `}
                    onClick={handleNextPage}
                    disabled={endIndex >= reviewPages.length}
                  >
                    <span className=" rotate-[-90deg] ">
                      {" "}
                      <RightLogo />{" "}
                    </span>
                  </button>
                </div>
              </div>
            
          </>
        ) : (
          <div className='flex flex-col gap-[30px] items-center relative top-[50%]'>
            <div className='flex gap-[24px] items-center flex-col'>
              <AddReview className='w-[150px] h-[130px]' />
              <p className='text-center'>No reviews to display</p>
            </div>
            <button
              className='btn btn-primary'
              onClick={() => {
                setModalOpen(true)
                setIsEditMode(false)
              }}
            >
              Add Review Page
            </button>
          </div>
        )}

        {/* Modal for adding/editing a review page */}
        <Modal isOpen={modalOpen} onClose={resetModal}>
          <div className='w-full flex flex-col items-start gap-3 sm:px-5 px-0 '>
            <div className='flex flex-col items-start gap-0 mb-3'>
              <h2 className='h4 font-medium'>
                {isEditMode ? 'Edit' : 'Add'} Review Page
              </h2>
              <p className='text-left'>
                Fill out the form below{' '}
                {isEditMode ? 'to edit an existing page' : 'to add a new page'}
              </p>
            </div>
            <form
              onSubmit={handleSave}
              className='w-full flex flex-col items-end'
            >
              <FormInput>
                <label className='h6' htmlFor='title'>
                  Title
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Enter Title'
                  required
                />
              </FormInput>
              <FormInput>
                <label className='h6' htmlFor='body'>
                  Body
                </label>
                <TextEditor
                  value={formData.body}
                  onChange={newValue =>
                    setFormData({ ...formData, body: newValue })
                  }
                />
              </FormInput>
              <FormInput>
                <label className={`h6 `} htmlFor='reviewLink'>
                  Location
                </label>
                {isEditMode ? (
                  <input
                    value={formData.location?.[0]?.name || ''}
                    placeholder={`${formData.location?.[0]?.name}`}
                    disabled
                  />
                ) : (
                  <select
                    type='text'
                    id='reviewLink'
                    value={formData.location || ' '}
                    onChange={handleAddOptions}
                    name='review-link'
                    className='w-full p-2 border rounded-md'
                    placeholder='Enter location name'
                  >
                    {showLocation?.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormInput>
              <FormInput>
                <label className='h6' htmlFor='buttonLabel'>
                  Button Label
                </label>
                <input
                  type='text'
                  name='buttonLabel'
                  id='buttonLabel'
                  value={formData.buttonLabel}
                  onChange={e =>
                    setFormData({ ...formData, buttonLabel: e.target.value })
                  }
                  placeholder='Enter Button Label'
                  required
                />
              </FormInput>
              <button type='submit' className='btn btn-primary'>
                {isEditMode ? 'Update Page' : 'Add Page'}
              </button>
            </form>
          </div>
        </Modal>

        {/* Confirm Delete Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          userName={pageToDelete ? pageToDelete.title : ''}
        />
      </div>
    </InnerLayout>
  )
}
