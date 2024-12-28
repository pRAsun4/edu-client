import React, { useState } from 'react';
import SettingsReview from './SettingsReview';
import { InnerLayout } from "../../layout/InnerLayout";
import { useParams } from "react-router-dom";
import { FormInput } from '../../components/Form/FormInput';
import { TextEditor } from '../../components/TextEditor';
import { useSelector, useDispatch } from 'react-redux';
import { setReviewFormData } from '../../features/appSlice';
import { updateReviewPage } from 'wasp/client/operations';
import { EditNav } from '../../components/Settings/EditNav';
import { FaStar } from 'react-icons/fa';


export default function SettingsPage() {
    const { id } = useParams(); 
    const currentReviewData = useSelector((state) => state.user.reviewFormData);
    const dispatch = useDispatch();
    // console.log(parseInt(id), "id");

    const handleInputChange = (field, value) => {
        dispatch(
            setReviewFormData({
                ...currentReviewData,
                [field]: value,
            })
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (currentReviewData) {
            await updateReviewPage({ id: parseInt(id), ...currentReviewData });
        } else {
            console.error("No data to save!");
        }
    };

    if (!currentReviewData) {
        return <p>Loading data...</p>;
    }

    return (
        <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={EditNav}>
            <div className="w-full max-w-[48rem] flex flex-col pt-6 card-bg rounded-md border">
                <div className="w-full px-6 pb-5">
                    <h2 className="h5">Template</h2>
                </div>
                <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
                    <FormInput>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={currentReviewData.title || ''}
                            placeholder="Review page name"
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </FormInput>
                    <FormInput>
                        <label htmlFor="Title">Title</label>
                        <input
                            type="text"
                            id="Title"
                            value={currentReviewData.title || ''}
                            placeholder="Review page Title"
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </FormInput>
                    <FormInput>
                        <label className="h6" htmlFor="body">Body</label>
                        <TextEditor
                            value={currentReviewData.body || ''}
                            onChange={(value) => handleInputChange('body', value)}
                        />
                    </FormInput>
                    <FormInput>
                        <label className="h6" htmlFor="footer">Footer</label>
                        <TextEditor
                            value={currentReviewData.footer || ''}
                            onChange={(value) => handleInputChange('footer', value)}
                        />
                    </FormInput>
                    <FormInput className="w-1/2 pb-3">
                        <label htmlFor="buttonLabel">Button Label</label>
                        <input
                            type="text"
                            id="buttonLabel"
                            value={currentReviewData.buttonLabel || ''}
                            placeholder="Review page Button Label"
                            onChange={(e) => handleInputChange('buttonLabel', e.target.value)}
                        />
                    </FormInput>
                </div>
                <FormInput className="w-full flex sm:items-end items-center p-3 m-0 border-t input-btn-div">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </FormInput>
            </div>
            <div className="w-full max-w-[48rem] flex flex-col pt-6 mt-6 card-bg rounded-md border">
                <div className="w-full px-6 pb-5" >
                    <h2 className="h5">Instructions</h2>
                </div>
                <div className="input-fields flex flex-col items-start px-6 py-3 gap-3 border-t">
                    <div className="w-full flex items-center justify-center p-4 " style={{ backgroundColor: 'var(--accent-color)'}}>
                        <p className="text-center">Show instructions directly above the form.</p>
                    </div>
                    <FormInput>
                        <label className="h6" htmlFor="body">Instructions for Negative Rating</label>
                        <TextEditor
                        // value={currentReviewData.body || ''}
                        // onChange={(value) => handleInputChange('body', value)}
                        />
                    </FormInput>
                    <FormInput>
                        <label className="h6" htmlFor="body">Instructions for Neutral Rating</label>
                        <TextEditor
                        
                        />
                    </FormInput>
                    <FormInput>
                        <label className="h6" htmlFor="body">Instructions for Positive Rating</label>
                        <TextEditor
                        
                        />
                    </FormInput>
                </div>
                <FormInput className="w-full flex sm:items-end items-center p-3 m-0 border-t input-btn-div">
                    <button
                        type="button"
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </FormInput>
            </div>
            <div className="w-full max-w-[48rem] flex flex-col pt-6 mt-6 card-bg rounded-md border">
                <div className="w-full px-6 pb-5">
                    <h2 className="h5">Options</h2>
                </div>
                <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
                    <FormInput className=' md:w-1/2 w-full '>
                        <label className="h6" htmlFor="rating_selection">Rating Selection</label>
                        <select name="rating-selection" id="rating_selection">
                            <option value="value 1">Save rating before customer review</option>
                            <option value="value 2">Save rating before every review</option>
                            <option value="value 3">Never save rating before review</option>
                        </select>
                        <p className="">Save rating before a review is submitted.</p>
                    </FormInput>
                    <FormInput className=' md:w-1/2 w-full '>
                        <label className="h6" htmlFor="native_reviews">Native Reviews</label>
                        <select name="native-reviews" id="native_reviews">
                            <option value="value 1">Enable Native reviews</option>
                            <option value="value 2">Disable when links are visible</option>
                        </select>
                        <p className="">Allow customers to write positive reviews.</p>
                    </FormInput>
                    <FormInput className=' md:w-1/2 w-full '>
                        <label className="h6" htmlFor="editable_ratings">Editable Ratings</label>
                        <select name="editable-ratings" id="editable_ratings">
                            <option value="value 1">Customer can change ratings</option>
                            <option value="value 2">Customer can not change ratings</option>
                        </select>
                        <p className="">Allow customers to change their rating.</p>
                    </FormInput>
                    <FormInput className=' md:w-1/2 w-full '>
                        <label className="h6" htmlFor="recaptcha">Recaptcha</label>
                        <select name="recaptcha-review" id="recaptcha">
                            <option value="value 1">use reCAPTCH on review page</option>
                            <option value="value 2">Dont use reCAPTCH on review page</option>
                        </select>
                        <p className="">Allow customers to change their rating.</p>
                    </FormInput>
                </div>
                <FormInput className="w-full flex sm:items-end items-center p-3 m-0 border-t input-btn-div">
                    <button
                        type="button"
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </FormInput>
            </div>
            <div className="w-full max-w-[48rem] flex flex-col pt-6 mt-6 card-bg rounded-md border">
                <div className="w-full px-6 pb-5">
                    <h2 className="h5">Notifications</h2>
                </div>
                <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
                    <FormInput className=' w-full '>
                        <label className="h6" htmlFor="rating_selection">Email for Notifications</label>
                        <input type="text" name="newslatter" id="news_latter" />
                        <p className="">Send review notifications to this address.</p>
                    </FormInput>
                    
                </div>
                <FormInput className="w-full flex sm:items-end items-center p-3 m-0 border-t input-btn-div">
                    <button
                        type="button"
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </FormInput>
            </div>
        </InnerLayout>
    );
}
 