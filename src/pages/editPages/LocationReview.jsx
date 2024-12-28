import React, { useState, useEffect } from "react";
import { InnerLayout } from "../../layout/InnerLayout";
import { EditNav } from "../../components/Settings/EditNav";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { FormInput } from "../../components/Form/FormInput";
import {
  getLocation,
  getReviewPages,
  updateReviewPage,
  useQuery,
} from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";

export default function LocationReview() {
  const { data: user } = useAuth();
  const { id } = useParams();
  const { data: currentPage } = useQuery(getReviewPages, {
    organizationId: user?.organizationId,
  });
  const { data: showLocation } = useQuery(getLocation);

  const [formData, setFormData] = useState({
    location: "",
  });
  console.log(currentPage, "curr p");
  

  
  useEffect(() => {
    if (currentPage) {
      const reviewPage = currentPage.find((page) => page.id === parseInt(id));
      if (reviewPage) {
        setFormData({
          location: reviewPage.locationId || "", 
        });
      }
    }
  }, [currentPage, id]);

  const handleAddOptions = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      locations: selectedLocation,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateReviewPage({
        id: parseInt(id),
        locations: formData.locations,
      });
    //   console.log("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };


  return (
    <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={EditNav}>
      <div className="w-full max-w-[48rem] flex flex-col pt-6 card-bg rounded-md border">
        <div className="w-full px-6 pb-5">
          <h2 className="h5">Locations</h2>
        </div>
        <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
          <div
            className="w-full p-4 flex items-center justify-center "
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <h6 className="p text-center max-w-[35rem] w-full ">
              Select the locations that should use this review page. A location
              can only be assigned to one review page. If a location is not
              assigned one, it will use the default review page.
            </h6>
          </div>
          <FormInput className="md:w-1/2 w-full mt-6">
            <label className="h6" htmlFor="reviewLink">
              Location
            </label>

            <select
              id="reviewLink"
              value={formData.location || ""}
              onChange={handleAddOptions}
              name="review-link"
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>
                Select a location
              </option>
              {showLocation?.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
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
