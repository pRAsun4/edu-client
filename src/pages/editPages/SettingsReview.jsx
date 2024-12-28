import React from 'react'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { EditNav } from '../../components/Settings/EditNav';
import { InnerLayout } from '../../layout/InnerLayout';
export default function SettingsReview({ children }) {

  return (
    <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={EditNav} >
      {children} 
      {/* not in use */}
    </InnerLayout>
  )
}