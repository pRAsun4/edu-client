// src/pages/Review.js

import { getLocation, getReviews, useQuery } from 'wasp/client/operations'
import { InnerLayout } from '../layout/InnerLayout'
import { MdReviews } from 'react-icons/md'
import AddReview from '../assets/svg/AddReview'
import Great from '../assets/svg/Great'
import Good from '../assets/svg/Good'
import Okay from '../assets/svg/Okay'
import Bad from '../assets/svg/Bad'
import Terrible from '../assets/svg/Terrible'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveButton } from '../features/appSlice'

export const ReviewPage = () => {
  const dispatch = useDispatch()

  const { data: allLocations } = useQuery(getLocation)
  const { data: reviews, isLoading, isError } = useQuery(getReviews)
  const [activeIndexButton, setActiveIndexButton] = useState(null)
  const [filteredReviews, setFilteredReviews] = useState([])
  const activeRating = useSelector(state => state.user.activeButton)
  // console.log(reviews, "reviews");

  // ALL LOCATION FILTER TO BE IMPLEMENTED USING DEFINING A STATE.

  useEffect(() => {
    if (activeRating !== null) {
      handleFilter(activeRating)
    } else {
      handleFilter(0)
    }
  }, [])

  const handleFilter = index => {
    if (index === 4) {
      setFilteredReviews(reviews?.filter(review => review.rating === 1))
      setActiveIndexButton(4)
    } else if (index === 3) {
      setFilteredReviews(reviews?.filter(review => review.rating === 2))
      setActiveIndexButton(3)
    } else if (index === 2) {
      setFilteredReviews(reviews?.filter(review => review.rating === 3))
      setActiveIndexButton(2)
    } else if (index === 1) {
      setFilteredReviews(reviews?.filter(review => review.rating === 4))
      setActiveIndexButton(1)
    } else if (index === 0) {
      setFilteredReviews(reviews?.filter(review => review.rating === 5))
      setActiveIndexButton(0)
    } else {
      setFilteredReviews(reviews || [])
      setActiveIndexButton(null)
    }

    // Reset activeRating in the store
    dispatch(setActiveButton(null))
  }

  const handleLocationFilter = () => {}

  if (isLoading) {
    return (
      <InnerLayout childHeader='Reviews' ChildIcon={MdReviews}>
        <div>Loading reviews...</div>
      </InnerLayout>
    )
  }
  if (isError) {
    return (
      <InnerLayout childHeader='Reviews' ChildIcon={MdReviews}>
        <div>Error loading reviews</div>
      </InnerLayout>
    )
  }

  // Count reviews by rating
  const ratingData = [
    {
      title: 'Great',
      count: 0,
      icon: <Great />,
      color: 'rgba(180, 228, 215, 0.3)'
    },
    {
      title: 'Good',
      count: 0,
      icon: <Good />,
      color: 'rgba(182, 224, 140, 0.3)'
    },
    {
      title: 'Okay',
      count: 0,
      icon: <Okay />,
      color: 'rgba(255, 248, 232, 1)'
    },
    { title: 'Bad', count: 0, icon: <Bad />, color: 'rgba(255, 237, 209, 1)' },
    {
      title: 'Terrible',
      count: 0,
      icon: <Terrible />,
      color: 'rgba(251, 154, 157, 0.3)'
    }
  ]

  reviews.forEach(review => {
    if (review.rating === 5) ratingData[0].count++
    else if (review.rating === 4) ratingData[1].count++
    else if (review.rating === 3) ratingData[2].count++
    else if (review.rating === 2) ratingData[3].count++
    else if (review.rating === 1) ratingData[4].count++
  })

  return (
    <InnerLayout childHeader='Reviews' ChildIcon={MdReviews}>
      <div className='w-full h-full flex flex-col gap-7 review-dash-page'>
        {/* Header Section */}
        <div className='w-full flex items-center justify-between filter-div'>
          {reviews && reviews.length > 0 ? (
            <>
              <h4 className='font-medium'>Reviews</h4>
              <div className='filter-box flex items-center gap-5'>
                <p>Filter</p>
                <select
                  name='location'
                  id='locationFilter'
                  onChange={handleLocationFilter}
                  className='p-4 cursor-pointer'
                >
                  <option value='All location'>All locations</option>
                  {allLocations &&
                    allLocations.map((location, index) => (
                      <option value={location.name} key={index}>
                        {location.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          ) : null}
        </div>

        {/* Review Table */}
        <div className='w-full h-full'>
          <div className='w-full overflow-x-auto h-full'>
            {reviews && reviews.length > 0 ? (
              <table className='w-full rounded-md overflow-hidden reviews_pages'>
                <thead>
                  <tr>
                    {ratingData.map((data, index) => (
                      <th
                        key={index}
                        width='240px'
                        className={`text-left ${
                          activeIndexButton === index ? 'thead-border' : ''
                        } `}
                        style={{
                          backgroundColor:
                            activeIndexButton === index
                              ? `var(--body-background)`
                              : data.color,
                          transition: '.3s ease'
                        }}
                      >
                        <button
                          className='w-full'
                          onClick={() => handleFilter(index)}
                        >
                          <span
                            className={`w-[2.625rem] h-[2.625rem] inline-flex items-center justify-center rounded-md`}
                            style={{
                              backgroundColor:
                                activeIndexButton === index
                                  ? data.color
                                  : 'var(--body-background)',
                              transition: '.3s ease'
                            }}
                          >
                            {data.icon}
                          </span>
                          <span className='ml-3'>
                            <p className='text-[1rem] font-normal review-title text-left'>
                              {data.title}
                            </p>
                            <p
                              className='text-[1rem] font-normal review-count text-left'
                              style={{ color: 'var(--table-sub-text)' }}
                            >
                              {data.count}
                            </p>
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews && filteredReviews.length == 0 ? (
                    <tr>
                      <td className='px-10 py-6 '></td>
                      <td className='px-10 py-6 '></td>
                      <td className='px-10 py-6 '>No reviews to display</td>
                      <td className='px-10 py-6 '></td>
                      <td className='px-10 py-6 '></td>
                    </tr>
                  ) : (
                    <tr>
                      <th width='240px' className='px-10 py-6 '>
                        Customer
                      </th>
                      <th width='240px' className='px-10 py-6 '>
                        Rating
                      </th>
                      <th width='240px' className='px-10 py-6 '>
                        Location
                      </th>
                      <th width='240px' className='px-10 py-6 '>
                        Review
                      </th>
                      <th width='240px' className='px-10 py-6 '>
                        Date
                      </th>
                    </tr>
                  )}
                  {filteredReviews &&
                    filteredReviews.map(review => (
                      <tr key={review.id}>
                        <td width='240px' className='px-10 py-6'>
                          {review.customer?.name}
                        </td>
                        <td width='240px' className='px-10 py-6 '>
                          {review.rating === 5 ? (
                            <div className='flex items-center gap-2'>
                              <span className='smily'>
                                <Great />{' '}
                              </span>
                              <span className='reaction-title !text-[#B4E4D7]'>
                                Great
                              </span>
                            </div>
                          ) : review.rating === 4 ? (
                            <div className='flex items-center gap-2'>
                              <span className='smily'>
                                <Good />{' '}
                              </span>
                              <span className='reaction-title !text-[#94BC6D]'>
                                Good
                              </span>
                            </div>
                          ) : review.rating === 3 ? (
                            <div className='flex items-center gap-2'>
                              <span className='smily'>
                                <Okay />{' '}
                              </span>
                              <span className='reaction-title !text-[#FFDA7D]'>
                                Okay
                              </span>
                            </div>
                          ) : review.rating === 2 ? (
                            <div className='flex items-center gap-2'>
                              <span className='smily'>
                                <Bad />{' '}
                              </span>
                              <span className='reaction-title !text-[#FFA691]'>
                                Bad
                              </span>
                            </div>
                          ) : review.rating === 1 ? (
                            <div className='flex items-center gap-2'>
                              <span className='smily'>
                                <Terrible />{' '}
                              </span>
                              <span className='reaction-title !text-[#FB9A9D] '>
                                Terrible
                              </span>
                            </div>
                          ) : null}
                        </td>
                        <td width='240px' className='px-10 py-6'>
                          {review.location?.name || 'No location'}
                        </td>
                        <td
                          width='240px'
                          className='px-10 py-6 text-ellipsis overflow-hidden'
                        >
                          {review.content.length > 18
                            ? `${review.content.substring(0, 17)}...`
                            : review.content}
                        </td>
                        <td width='240px' className='px-10 py-6'>
                          {new Date(review.createdAt).toLocaleDateString() ||
                            'No Date'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className='flex flex-col gap-[30px] items-center h-full justify-center'>
                <div>
                  <AddReview className='w-[200px] h-[200px]' />
                  <p className='text-center'>No reviews to display</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </InnerLayout>
  )
}
