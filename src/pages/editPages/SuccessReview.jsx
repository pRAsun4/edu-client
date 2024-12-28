import React, { useState } from "react";
import SettingsReview from "./SettingsPage";
import { EditNav } from "../../components/Settings/EditNav";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InnerLayout } from "../../layout/InnerLayout";
import { FormInput } from "../../components/Form/FormInput";
import { createReviewInfo, getReviewInfo , useQuery } from "wasp/client/operations";

export default function SuccessReview() {
  const { id } = useParams();
  const {data: currentInfo } = useQuery(getReviewInfo, {
    reviewPageId: parseInt(id),
  })
  // console.log(currentInfo, "page info");
  
  
  // State for form inputs
  const [reviewMessage, setReviewMessage] = useState({
    title: "",
    // reviewPage: "",
    copiedMessage: "",
    buttonLable: "",
    buttonLink: "",
    createdAt: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setReviewMessage((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    // Validate inputs
    const { title, copiedMessage, buttonLable, buttonLink } = reviewMessage;
    if (!title || !copiedMessage || !buttonLable) {
      setError(
        "Please fill in all required fields: Title, Copied Message, and Button Label."
      );
      return;
    }

    try {
      const formattedDate = reviewMessage.createdAt
        ? new Date(reviewMessage.createdAt).toISOString()
        : new Date().toISOString();

      const reviewInfo = await createReviewInfo({
        id: parseInt(id),
        ...reviewMessage,
        createdAt: formattedDate,
      });

      setSuccess("Review information saved successfully!");
      setReviewMessage({
        title: "",
        copiedMessage: "",
        buttonLable: "",
        buttonLink: "",
        createdAt: "",
      });
    } catch (error) {
      console.error("Error saving review information:", error);
      setError("An error occurred while saving. Please try again.");
    }
  };

  return (
    <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={EditNav}>
      <div className="w-full max-w-[48rem] flex flex-col pt-6 card-bg rounded-md border">
        <div className="w-full px-6 pb-5">
          <h2 className="h5">Success Page</h2>
          {/* {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>} */}
        </div>
        <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
          <FormInput>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={reviewMessage.title}
              onChange={handleChange}
              placeholder="Thanks for your feedback"
              required
            />
          </FormInput>
          <FormInput>
            <label htmlFor="copiedMessage">Copied Message *</label>
            <input
              type="text"
              id="copiedMessage"
              value={reviewMessage.copiedMessage}
              onChange={handleChange}
              placeholder="Your review has been copied to your clipboard so you can paste it elsewhere."
              required
            />
            <p>Shown after a positive review has been submitted.</p>
          </FormInput>
          <FormInput>
            <label htmlFor="buttonLable">Button Label *</label>
            <input
              type="text"
              id="buttonLable"
              value={reviewMessage.buttonLable}
              onChange={handleChange}
              placeholder="Close Window"
              required
            />
          </FormInput>
          <FormInput>
            <label htmlFor="buttonLink">Button Link</label>
            <input
              type="text"
              id="buttonLink"
              value={reviewMessage.buttonLink}
              onChange={handleChange}
              placeholder="https://mydomain.com"
            />
            <p>
              If blank, the link defaults to your project website, otherwise the
              domain of the page.
            </p>
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
    </InnerLayout>
  );
}
