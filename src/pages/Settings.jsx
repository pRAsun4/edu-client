import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { Link } from "react-router-dom";
import { FaCog, FaCopy } from "react-icons/fa";
import { FormInput } from "../components/Form/FormInput";
import { MdDelete } from "react-icons/md";
import {
  getOrganization,
  updateOrganization,
  useQuery,
} from "wasp/client/operations";
import { useEffect, useState } from "react";
export const Settings = ({ user }) => {
  
  if(!user.organizationId){
    return (
      <InnerLayout Nav={SettingsNav} childHeader="Settings" ChildIcon={FaCog}>
        <div>
          <h4>You are not authorized to view this page</h4>
        </div>
        </InnerLayout>
    )
  }

  const {
    data: orgName,
    isLoading,
    isError,
    refetch,
  } = useQuery(getOrganization, {
    id: user.organizationId,
  });
  const [organization, setOrganization] = useState({
    name: "",
    slug: "",
    websiteUrl: "",
    reviewsVisible: false,
  });

  useEffect(() => {
    if (orgName) {
      setOrganization({
        name: orgName.name || "",
        slug: orgName.slug || "",
        websiteUrl: orgName.websiteUrl || "",
        reviewsVisible: orgName.reviewsVisible || false,
      });
    }
  }, [orgName]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization({ ...organization, [name]: value });
  };

  // Handle the toggle of reviewsVisible
  const handleToggleVisibility = (e) => {
    setOrganization({
      ...organization,
      reviewsVisible: e.target.value === "true",
    });
  };

  // Handle form save (API call to update organization)
  const handleSave = async () => {
    try {
      await updateOrganization({
        organizationId: user.organizationId,
        name: organization.name,
        slug: organization.slug,
        websiteUrl: organization.websiteUrl,
        reviewsVisible: organization.reviewsVisible,
      });
      alert("Organization details updated successfully!");
      refetch(); // Refresh the data after successful update
    } catch (error) {
      console.error("Error updating organization:", error);
      alert("Failed to update organization details.");
    }
  };

  return (
    <InnerLayout Nav={SettingsNav} childHeader="Settings" ChildIcon={FaCog}>
      <div className=" w-full h-full flex  items-center justify-center  ">
        <div className=" max-w-3xl w-full h-full  flex flex-col gap-5 inner-body rounded-md  ">
          <div className="w-full flex flex-col border rounded-md card-bg ">
            <div className="upper-settings-body w-full h-auto flex justify-between items-center  p-4 border-b ">
              <Link to="/settings" className="h5 font-medium">
                Settings
              </Link>
              {/* <Link to="/#" className="h5 font-medium inline-flex items-center gap-2 ">
                        Id
                        <FaCopy size={16} />
                     </Link> */}
            </div>
            <div className="w-full p-6 flex flex-col items-start justify-center  ">
              <FormInput className="w-full">
                <label htmlFor="name" className="p">
                  Organization name
                </label>
                <input
                  type="text"
                  name="name"
                  value={(organization && organization.name) || ""}
                  onChange={handleChange}
                  className="px-4 py-2"
                  placeholder="Enter your Project name"
                />
              </FormInput>
              <div className="flex flex-row w-full gap-4">
                <FormInput className="lg:w-1/2">
                  <label htmlFor="name" className="p">
                    Google analytics Id
                  </label>
                  <input
                    type="text"
                    className="px-4 py-2"
                    placeholder="G-XXXXXXXX"
                  />
                </FormInput>
                <FormInput className="lg:w-1/2">
                  <label htmlFor="visibility" className="p">
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    value={organization.reviewsVisible.toString()}
                    readOnly
                    onChange={handleToggleVisibility}
                    name="reviewsVisible"
                    className="px-4 py-2"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </FormInput>
              </div>

              {/* currency drop down */}
              {/* <FormInput className="lg:w-1/2">
                        <label htmlFor="currency" className=" font-medium">Currency</label>
                        <select
                           id="currency"
                           className="px-4 py-2"
                        >
                           <option value="USD">USD - US Dollar</option>
                           <option value="EUR">EUR - Euro</option>
                           <option value="GBP">GBP - British Pound</option>
                           <option value="JPY">JPY - Japanese Yen</option>
                           <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                     </FormInput> */}
            </div>
            <FormInput className="w-full flex sm:items-end items-center p-6 m-0 border-t input-btn-div ">
              <button
                type="button"
                onClick={handleSave}
                className=" btn btn-primary"
              >
                Save
              </button>
            </FormInput>
          </div>

          <div className="max-w-3xl w-full h-full  flex flex-col rounded-md border card-bg">
            <div className="lower-settings-body w-full h-auto flex justify-between items-center  p-4 border-b ">
              <Link to="/settings" className="h5 font-medium">
                Slug
              </Link>
            </div>
            <div className="w-full p-6">
              <FormInput className="w-full m-0">
                <p htmlFor="slug" className="text-gray-400">
                  Used in customer facing emails and links if a domain is not
                  set for the project.
                </p>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  value={(organization && organization.slug) || ""}
                  onChange={handleChange}
                  className="px-4 py-2"
                  placeholder="Enter your Slug"
                />
              </FormInput>
            </div>
            <div className="w-full p-6 flex sm:justify-end justify-center border-t input-btn-div ">
              <button
                type="button"
                onClick={handleSave}
                className=" btn btn-primary "
              >
                Save
              </button>
            </div>
          </div>

          {user.role == "SUPER_ADMIN" ? (
            <div className="w-full max-w-3xl h-full flex items-center justify-center sm:justify-between flex-wrap gap-5 p-5 rounded-md bg-second border card-bg">
              <button type="button" className="flex btn border ">
                Duplicate project
                <FaCopy size={20} />
              </button>
              <button type="button" className="flex btn border dlt-btn">
                <MdDelete size={20} />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </InnerLayout>
  );
};
