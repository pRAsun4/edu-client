import React, { useState } from "react";
import { InnerLayout } from "../layout/InnerLayout";
import { IoLocationSharp } from "react-icons/io5";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { Link } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPencilLine } from "react-icons/lu";
import { FormInput } from "../components/Form/FormInput";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
  createLocation,
  deleteLocation,
  getReviewPages,
  updateLocation,
  useQuery,
} from "wasp/client/operations";
import { getLocation } from "wasp/client/operations";
export default function Location({ user, location }) {
  const {
    data: seeLocation,
    isLoading,
    isError,
    refetch,
  } = useQuery(getLocation);
  const { data: reviewPages } = useQuery(getReviewPages, {
    organizationId: user.organizationId,
  });
  const [activeModal, setActiveModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [locationName, setLocationName] = useState({
    location_name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    storeCode: "",
    reviewLink: "",
  });
  const [editDetails, setEditDetails] = useState({
    location_name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    storeCode: "",
    reviewLink: "",
  });

  // Open Create Location Modal
  const handleModalOpen = () => {
    setActiveModal(true);
  };

  // Close Create Location Modal
  const handleModalClose = () => {
    setActiveModal(false);
    setLocationName("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setLocationName((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSelectReviewLink = (e) => {
    const selectedReviewLink = e.target.value;
    setLocationName((prevState) => ({
      ...prevState,
      reviewLink: selectedReviewLink,
    }));
  };

  // Create Location
  const handleCreateLocation = async (e) => {
    e.preventDefault();

    if (!locationName.location_name.trim()) {
      alert("Location Name is required");
      return;
    }

    try {
      const newLocation = await createLocation({
        location_name: locationName.location_name,
        address: locationName.address,
        city: locationName.city,
        state: locationName.state,
        zipCode: locationName.zipCode,
        reviewLink: locationName.reviewLink,
        organizationId: user.organizationId,
      });

      setLocations([...locations, newLocation]);
      refetch();
      handleModalClose();
    } catch (error) {
      console.error("Failed to create location:", error);
      alert("Error creating location. Please try again.");
    }
  };

  // Open Edit Modal
  const handleEditModalOpen = (location) => {
    setSelectedLocation(location);
    setEditDetails({
      location_name: location.name,
      address: location.address1 || "",
      city: location.city || "",
      state: location.state || "",
      zipCode: location.zipCode || "",
      storeCode: location.storeCode || "",
      reviewLink: location.reviewPages?.[0]?.id || "",
    });
    setEditModal(true);
  };

  // Close Edit Modal
  const handleEditModalClose = () => setEditModal(false);

  // Handle Edit Input Changes
  const handleEditDetailsChange = (field, value) => {
    setEditDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  // Save Updated Location
  const handleSaveLocation = async () => {
    try {
      const updatedLocation = await updateLocation({
        id: selectedLocation.id,
        ...editDetails,
        reviewLink: editDetails.reviewLink,
      });
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc.id === selectedLocation.id ? updatedLocation : loc
        )
      );
      handleEditModalClose();
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  // Delete Location
  const handleDeleteLocation = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation({ id });
        setLocations((prevLocations) =>
          prevLocations.filter((loc) => loc.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete location:", error);
      }
    }
  };

  return (
    <InnerLayout
      Nav={SettingsNav}
      childHeader="Location"
      ChildIcon={IoLocationSharp}
    >
      <div className="w-full max-w-3xl flex flex-col items-start justify-center relative">
        {seeLocation && seeLocation.length > 0 && (
          <div className="flex justify-between w-full">
            <h4 className="h4 font-medium">Locations</h4>
            <button className="btn btn-primary" onClick={handleModalOpen}>
              Add New Location
            </button>
          </div>
        )}
        <div className="!mt-4 w-full h-fit max-h-[30rem] flex flex-col rounded-md location-inner-body border card-bg">
          {seeLocation && seeLocation.length > 0 ? (
            <>
              <div className="p-4 sm:p-6">
                {seeLocation &&
                  seeLocation.map((location) => (
                    <div
                      key={location.id}
                      className="flex justify-between items-start sm:flex-row flex-col sm:items-center gap-4 p-4 loc_card"
                    >
                      <div className="flex gap-0 flex-col items-start">
                        <div className="flex justify-start gap-2 items-center">
                          <HiOutlineLocationMarker size={24} />
                          <h6>{location.name}</h6>
                        </div>
                        <p>
                          {location.address1},
                          <span> {location.city}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          name="Edit Location"
                          className="btn btn-outline mr-[1rem]"
                          onClick={() => handleEditModalOpen(location)}
                        >
                          <LuPencilLine size={24} />
                          Edit Location
                        </button>
                        <button
                          name="Delete Location"
                          className="btn btn-outline tomato-btn-bg"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <RiDeleteBin6Line size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="w-full px-6 py-10 ">
              <div className="w-full flex flex-col items-center justify-center">
                <span className="w-[100px] h-[100px] location-icon-box flex items-center justify-center rounded-full border">
                  <HiOutlineLocationMarker size={34} />
                </span>
                <h5 className="font-medium mt-4">Create a Location</h5>
                <p className="text-center mt-2 w-4/5">
                  Create a location so you can attribute reviews to multiple
                  locations.
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={handleModalOpen}
                >
                  Create Location
                </button>
              </div>
            </div>
          )}

          {/* Create Location Modal */}
          {activeModal && (
            <Modal
              isOpen={activeModal}
              onClose={handleModalClose}
              modalHeader="Create Location"
              className="loc_page"
            >
              <div className="w-full p-3 sm:p-6 pt-0 loaction_modal">
                <FormInput>
                  <label htmlFor="locationName">Location Name</label>
                  <input
                    type="text"
                    id="location_name"
                    name="location-name"
                    value={locationName.location_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="locationName">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address-line-1"
                    value={locationName.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="locationName">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={locationName.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="locationName">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={locationName.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="locationName">Zipcode</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zip-code"
                    value={locationName.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  />
                </FormInput>

                <FormInput>
                  <label htmlFor="locationName">Review Link</label>
                  <select
                    type="text"
                    id="reviewLink"
                    name="review-link"
                    value={locationName.reviewLink}
                    onChange={handleSelectReviewLink}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter location name"
                    required
                  >
                    <option value="" disabled>
                      Select Review Page
                    </option>
                    {reviewPages?.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </FormInput>
              </div>
              <div className="w-full flex justify-center px-5 pb-5">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateLocation}
                >
                  Create Location
                </button>
              </div>
            </Modal>
          )}

          {/* Edit Location Modal */}
          {editModal && (
            <Modal
              isOpen={editModal}
              onClose={handleEditModalClose}
              modalHeader="Edit Location"
              className="loc_page"
            >
              <div className="w-full p-6 pt-0 space-y-4">
                <FormInput>
                  <label htmlFor="editName">Location Name</label>
                  <input
                    type="text"
                    id="editName"
                    value={editDetails.location_name}
                    onChange={(e) =>
                      handleEditDetailsChange("location_name", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={editDetails.address}
                    onChange={(e) =>
                      handleEditDetailsChange("address", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={editDetails.city}
                    onChange={(e) =>
                      handleEditDetailsChange("city", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={editDetails.state}
                    onChange={(e) =>
                      handleEditDetailsChange("state", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={editDetails.zipCode}
                    onChange={(e) =>
                      handleEditDetailsChange("zipCode", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="storeCode">Store Code</label>
                  <input
                    type="text"
                    id="storeCode"
                    value={editDetails.storeCode}
                    onChange={(e) =>
                      handleEditDetailsChange("storeCode", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </FormInput>
                <FormInput>
                  <label htmlFor="reviewPage">Link to Review Page</label>
                  <select
                    name="review"
                    id="reviewPage"
                    value={editDetails.reviewLink || ""}
                    onChange={(e) =>
                      handleEditDetailsChange("reviewLink", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {/* previously selected reviewpage */}
                    {editDetails.reviewLink && (
                      <option
                        value={editDetails.reviewLink}
                        key={`selected-${editDetails.reviewLink}`}
                      >
                        {reviewPages?.find(
                          (page) => page.id === parseInt(editDetails.reviewLink)
                        )?.title || "Selected Review Page"}
                      </option>
                    )}

                    {/* other reviewpages except selected one */}
                    {reviewPages
                      ?.filter(
                        (page) => page.id !== parseInt(editDetails.reviewLink)
                      )
                      .map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                  </select>
                </FormInput>
              </div>
              <div className="w-full flex justify-center p-5">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveLocation}
                >
                  Save
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </InnerLayout>
  );
}
