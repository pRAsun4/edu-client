import React from 'react'
import { useState, useRef } from 'react'
import { FormInput } from '../components/Form/FormInput'
import { GrCloudUpload } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6'
import { createCustomer } from 'wasp/client/operations'
import { FaRegTrashAlt } from 'react-icons/fa'
import { LiaTimesSolid } from 'react-icons/lia'

function ReviewModal ({ className}) {
  const [imporModal, setImportModal] = useState(false)
  const [activeNav, setActiveNav] = useState(0)
  const [hide, setHide] = useState(true)
  const [activeReviewOptions, setActiveReviewOptions] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [error, setError] = useState('')
  const [groupedData, setGroupedData] = useState([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)

  const [saveStatus, setSaveStatus] = useState('')

  const [errorStatus, setErrorStatus] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [inputKey, setInputKey] = useState(0)

  const handleCheck = () => {
    setIsChecked(prevState => !prevState)
  }

  const truncateFileName = (name, length = 10) => {
    const parts = name.split('.')
    const extension = parts.length > 1 ? '.' + parts.pop() : ''
    const baseName = parts.join('.')

    if (baseName.length > length) {
      return (
        baseName.substring(0, length - 1) +
        '...' +
        baseName.slice(-1) +
        extension
      )
    }
    return baseName + extension
  }

  const handleDeleteFile = () => {
    setFileName(null)
    setCsvData([])
    setGroupedData([])
    setCurrentGroupIndex(0)
    setInputKey(prevKey => prevKey + 1) // Change the key to force re-render
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : null)

    if (!file) {
      setError('No file selected')
      return
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.')
      return
    }

    // Parse CSV file using PapaParse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const data = results.data

        setError('')
        setCsvData(data)

        // Group the data into groups of 5
        const groups = []
        for (let i = 0; i < data.length; i += 5) {
          groups.push(data.slice(i, i + 5))
        }
        setGroupedData(groups)
        setCurrentGroupIndex(0) // Reset group index
      },
      error: error => {
        setError(`Error parsing CSV file: ${error.message}`)
      }
    })
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'public',
    createdAt: ''
  })


  const handleCreateCustomer = async e => {
    e.preventDefault()

    try {
      const formattedDate = formData.createdAt
        ? new Date(formData.createdAt).toISOString()
        : new Date().toISOString()
        
      const newCustomerAdd = await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organizationId: organizationId,
        location: formData.location,
        createdAt: formattedDate
      })

      console.log('Customer successfully created:', newCustomerAdd)

      // Clear the form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: 'public',
        createdAt: ''
      })

      alert('Customer created successfully!')
    } catch (error) {
      console.error('Failed to create Customer:', error)
      alert('Failed to Create Customer. Please try again.')
    }
  }

  return (
    <div className={`w-full flex flex-col  ${className}`}>
      <div className='tabContent'>
        <div className='firstTab tab_modal'>
          <div className={`req_date p-6 border mt-4 w-full rounded flex gap-3`}>
            <FormInput className='lg:w-1/2'>
              <label htmlFor='location' className='p'>
                Request Date
              </label>
              <input type='date' name='date' className='px-4 py-2' />
            </FormInput>
            <FormInput className='lg:w-1/2 mb-[20px]'>
              <label htmlFor='location' className='p'>
                Reminders
              </label>
              <select
                id='location'
                readOnly
                name='reviewsVisible'
                className='px-4 py-2'
              >
                <option value='public' defaultValue>
                  Don't send reminders
                </option>
                <option value='private'>Send 1 Reminder</option>
                <option value='private'>Send 2 Reminder</option>
                <option value='private'>Send 3 Reminder</option>
              </select>
            </FormInput>
          </div>
          <div
            className={`req_options p-6 pt-0 border mt-4 w-full rounded h-full`}
          >
            <div className='flex gap-3 mt-2'>
              <FormInput className='lg:w-1/2'>
                <label htmlFor='reviewPage' className='p'>
                  Review Page
                </label>
                <select id='reviewPage' name='reviewPage' className='px-4 py-2'>
                  <option value='public'>Default Page</option>
                  <option value='option1'>Option 1</option>
                </select>
              </FormInput>
              <FormInput className='lg:w-1/2'>
                <label htmlFor='location' className='p'>
                  Location
                </label>
                <select id='location' name='reviewPage' className='px-4 py-2'>
                  <option value='public'>Default Page</option>
                  <option value='option1'>Option 1</option>
                </select>
              </FormInput>
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button className='btn btn-primary' onClick={handleCreateCustomer}>
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
