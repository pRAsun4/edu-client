// src/pages/Dashboard.js

import { getReviews, useQuery } from 'wasp/client/operations'

export const DashboardPage = ({ user }) => {
  const { data: reviews, isLoading, isError } = useQuery(getReviews)

  if (isLoading) { return <div>Loading dashboard...</div> }
  if (isError) { return <div>Error loading dashboard</div> }

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Stats</h3>
        <p>Total Reviews: {reviews ? reviews.length : 0}</p>
        <p>Average Rating: {reviews ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : 'N/A'}</p>
      </div>
      <div>
        <h3>Latest Reviews</h3>
        {reviews && reviews.slice(0, 5).map(review => (
          <div key={review.id}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
