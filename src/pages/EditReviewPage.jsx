import React from 'react'
import { FaStar } from 'react-icons/fa'
import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from '../components/Settings/SettingsNav';
import { useSelector } from 'react-redux';
export default function EditReviewPages({id}) {
    const currentPageUrl = useSelector((state) => state.user.reviewPageURL);
    console.log(currentPageUrl, "page url");
    
  return (
    <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={SettingsNav} >
        this is edit revie pages
    </InnerLayout>
  )
}