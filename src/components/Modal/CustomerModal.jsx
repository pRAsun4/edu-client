import React from "react";
import { useState, useEffect } from "react";
import { FormInput } from "../Form/FormInput";
import { GrCloudUpload } from "react-icons/gr";
import Papa from "papaparse";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import {
  createCustomer,
  getReviewPages,
  useQuery,
} from "wasp/client/operations";
import { FaRegTrashAlt, FaDownload } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { TbLoaderQuarter } from "react-icons/tb";
import { useAuth } from "wasp/client/auth";

export default function CustomerModal({
  className,
  onStateChange,
  organizationId,
}) {
  const { data: user } = useAuth();
  const { data: currentReviewPages } = useQuery(getReviewPages, {
    organizationId: user?.organizationId,
  });
  const [imporModal, setImportModal] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [hide, setHide] = useState(true);
  const [activeReviewOptions, setActiveReviewOptions] = useState(false);
  const [error, setError] = useState("");
  const [groupedData, setGroupedData] = useState([]);
  const [saveStatus, setSaveStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [afterLoading, setAfterLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [inputKey, setInputKey] = useState(0);
  const [modalAlert, setModalAlert] = useState(false);
  const [reviewPages, setReviewPages] = useState({
    reviewPage: "",
  });

  const handleCheck = () => {
    setIsChecked((prevState) => !prevState);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);

    if (!file) {
      setError("No file selected");
      return;
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    // Parse CSV file using PapaParse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta, errors } = results;
        setError("");

        setGroupedData(data);
        setAfterLoading(true);

        const groups = [];
        for (let i = 0; i < data.length; i += 5) {
          groups.push(data.slice(i, i + 5));
        }
        // setGroupedData(groups); // Optionally group here if needed for visual representation
      },
      error: (error) => {
        setError(`Error parsing CSV file: ${error.message}`);
      },
    });
  };

  useEffect(() => {
    let timeout;

    if (errorStatus || saveStatus) {
      timeout = setTimeout(() => {
        setErrorStatus("");
        setSaveStatus("");
        setModalAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [errorStatus && saveStatus]);

  const handleDeleteFile = () => {
    setFileName(null);
    setGroupedData([]);
    setInputKey((prevKey) => prevKey + 1);
  };

  // console.log(groupedData, "data error");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "public",
    createdAt: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    try {
      // Format the date input properly
      const formattedDate = formData.createdAt
        ? new Date(formData.createdAt).toISOString()
        : new Date().toISOString();

      // Send the form data to the backend
      const newCustomerAdd = await createCustomer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organizationId: organizationId,
        createdAt: formattedDate,
      });

      console.log("Customer successfully created:", newCustomerAdd);

      // Clear the form after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "public",
        createdAt: "",
      });

      alert("Customer created successfully!");
    } catch (error) {
      console.error("Failed to create Customer:", error);
      alert("Failed to Create Customer. Please try again.");
    }
  };

  const handelReviewOptions = () => {
    if (activeReviewOptions === true) {
      setActiveReviewOptions(false);
    } else {
      setActiveReviewOptions(true);
    }
  };

  const ButtonData = [
    {
      name: "Manual Entry",
      type: "button",
    },
    {
      name: "Upload CSV",
      type: "button",
    },
    {
      name: "Integration",
      type: "button",
    },
  ];

  function handleHide() {
    setHide((prevState) => !prevState);
  }

  const handleSubmitCsv = async (e) => {
    e.preventDefault();
    setImportModal(true);
    setModalAlert(true);

    if (groupedData.length === 0) {
      setErrorStatus("No data to save.");
      return;
    }

    setIsLoading(true);
    setSaveStatus("Saving all groups...");

    try {
      const validData = groupedData.filter(
        (customer) =>
          customer.firstName?.trim() &&
          customer.lastName?.trim() &&
          customer.email?.trim()
      );

      if (validData.length === 0) {
        setErrorStatus("No valid data to save after filtering.");
        setIsLoading(false);
        return;
      }
  

      const groups = [];
      for (let i = 0; i < validData.length; i += 5) {
        groups.push(validData.slice(i, i + 5));
      }

      for (let i = 0; i < groups.length; i++) {
        const currentGroup = groups[i];
        setSaveStatus(`Saving Group ${i + 1} of ${groups.length}...`);

        // Save each row in the current group sequentially
        for (let customer of currentGroup) {
          const formattedDate = customer.createdAt
            ? new Date(customer.createdAt).toISOString()
            : new Date().toISOString();

          await createCustomer({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            organizationId: organizationId,
            createdAt: formattedDate,
          });
        }

        // Wait between groups to avoid rate limiting or heavy server load
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSaveStatus("All groups have been saved successfully!");
      setFileName(null);
      // setGroupedData([]); // Optional, depending on whether you want to clear data after save
    } catch (error) {
      setModalAlert(true);
      setErrorStatus(
        "An error occurred while saving the data! Please try again."
      );
    } finally {
      setIsLoading(false);
      // setAfterLoading(true); // Ensure it's set to true if needed
    }
  };

  const resetAlert = () => {
    setModalAlert(true);
    setImportModal(false);
  };

  const handleReviewData = (e) => {
    const selectedReviewPage = e.target.value;
    setReviewPages({ reviewPage: selectedReviewPage });
  };
  // console.log(reviewPages, "review page");

  return (
    <div className={`w-full flex flex-col  ${className}`}>
      {modalAlert && (
        <div
          className={` alertBox ${errorStatus && "error"} ${
            saveStatus && "success"
          } absolute top-0 left-0 ${imporModal && "active"} `}
        >
          {saveStatus && errorStatus ? (
            <span>{errorStatus}</span>
          ) : saveStatus ? (
            <span>{saveStatus}</span>
          ) : (
            <span>{errorStatus}</span>
          )}
          <button className={`z-10`} onClick={() => resetAlert()}>
            <LiaTimesSolid size={20} />
          </button>
        </div>
      )}

      <div className="button-entry-box w-full flex-wrap flex items-center gap-2 pt-2 border-b">
        {ButtonData.map((item, index) => (
          <button
            key={index}
            type={item.type}
            onClick={() => setActiveNav(index)}
            className={`btn badge-btn import-buttons ${
              activeNav === index ? "active" : ""
            } `}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="tabContent">
        {activeNav === 0 ? (
          <div className="firstTab tab_modal">
            <div className="w-full p-6 flex flex-col items-start justify-center border border-t-0 rounded rounded-t-none">
              <div className="flex w-full gap-3 mb-4">
                <FormInput className="lg:w-1/2">
                  <label htmlFor="firstName" className="p">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="px-4 py-2"
                    placeholder="First name"
                    value={formData.firstName}
                    required
                    onChange={handleInputChange}
                  />
                </FormInput>
                <FormInput className="lg:w-1/2">
                  <label htmlFor="lastName" className="p">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="px-4 py-2"
                    placeholder="Last name"
                    value={formData.lastName}
                    required
                    onChange={handleInputChange}
                  />
                </FormInput>
              </div>
              <FormInput className="w-full">
                <label htmlFor="name" className="p">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-4 py-2"
                  placeholder="Add email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormInput>
              <FormInput className="w-full">
                <label htmlFor="name" className="p">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phone"
                  className="px-4 py-2"
                  placeholder="Add phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormInput>
              <div className="flex w-full gap-3 mb-4">
                <FormInput className="lg:w-1/2">
                  <label htmlFor="location" className="p">
                    Signed Up
                  </label>
                  <input
                    type="date"
                    id="createdAt"
                    className="px-4 py-2"
                    placeholder="The customer's start date"
                    value={formData.createdAt}
                    onChange={handleInputChange}
                  />
                </FormInput>
              </div>
              <FormInput className="w-full flex flex-row items-center justify-content-start gap-2">
                <input
                  type="checkbox"
                  name="checkbox_option"
                  className="checkbox"
                  id="checkbox_option"
                  checked={isChecked}
                  onChange={() => {
                    handleCheck();
                    handleHide();
                  }}
                />

                <label
                  htmlFor="location"
                  className="p"
                  onClick={() => {
                    handleCheck();
                    handleHide();
                  }}
                >
                  Schedule Review Request?
                </label>
              </FormInput>
            </div>
            <div
              className={`req_date p-6 border mt-4 w-full rounded ${
                hide ? "hidden" : "flex gap-3"
              }`}
            >
              <FormInput className="lg:w-1/2">
                <label htmlFor="location" className="p">
                  Request Date
                </label>
                <input type="date" name="date" className="px-4 py-2" />
              </FormInput>
              <FormInput className="lg:w-1/2 mb-[20px]">
                <label htmlFor="location" className="p">
                  Reminders
                </label>
                <select
                  id="location"
                  readOnly
                  name="reviewsVisible"
                  className="px-4 py-2"
                >
                  <option value="public" defaultValue>
                    Don't send reminders
                  </option>
                  <option value="private">Send 1 Reminder</option>
                  <option value="private">Send 2 Reminder</option>
                  <option value="private">Send 3 Reminder</option>
                </select>
              </FormInput>
            </div>
            <div
              className={`req_options p-6 pt-0 border mt-4 w-full rounded ${
                hide ? "hidden" : "block"
              } ${
                activeReviewOptions
                  ? "h-full"
                  : "h-[60px] overflow-clip cursor-pointer"
              }`}
            >
              <h6
                className="p font-medium text-left py-4 flex justify-between items-center cursor-pointer"
                onClick={() => handelReviewOptions()}
              >
                Request Options
                <span>
                  {activeReviewOptions ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </h6>
              <div className="flex gap-3 mt-2">
                <FormInput className="lg:w-1/2">
                  <label htmlFor="reviewPage" className="p">
                    Review Page
                  </label>
                  <select
                    id="reviewPage"
                    name="reviewPage"
                    className="px-4 py-2"
                  >
                    <option value="public">Default Page</option>
                    <option value="option1">Option 1</option>
                  </select>
                </FormInput>
                <FormInput className="lg:w-1/2">
                  <label htmlFor="location" className="p">
                    Location
                  </label>
                  <select id="location" name="reviewPage" className="px-4 py-2">
                    <option value="public">Default Page</option>
                    <option value="option1">Option 1</option>
                  </select>
                </FormInput>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-primary"
                onClick={handleCreateCustomer}
              >
                Add Customer
              </button>
            </div>
          </div>
        ) : activeNav === 1 ? (
          <div className="secondTab tab_modal">
            {afterLoading ? (
              <div className="w-full flex flex-col items-start mt-4">
                <FormInput className="md:w-1/2 w-full flex  ">
                  <label className={`h6 `} htmlFor="reviewLink">
                    Review Pages
                  </label>
                  <select
                    id="reviewLink"
                    name="review-link"
                    className="w-auto p-2 border rounded-md"
                    value={reviewPages.reviewPage}
                    onChange={handleReviewData}
                  >
                    {currentReviewPages?.map((page, index) => (
                      <option value={page.title} key={index}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </FormInput>

                <div className="customer-list w-full overflow-x-auto h-full max-h-[500px]">
                  <table className="w-full rounded-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-4 text-left">id</th>
                        <th className="px-4 py-4 text-left">First Name</th>
                        <th className="px-4 py-4 text-left">Last Name</th>
                        <th className="px-4 py-4 text-left">Email</th>
                        <th className="px-4 py-4 text-left">Phone</th>
                        <th className="px-4 py-4 text-left">Added On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedData
                        ?.filter(
                          (customer) =>
                            !customer.firstName ||
                            customer.firstName.trim() === "" ||
                            !customer.lastName ||
                            customer.lastName.trim() === "" ||
                            !customer.email ||
                            customer.email.trim() === ""
                        )
                        .map((customer) => {
                          return (
                            <tr key={customer.id}>
                              <td width="300" className="px-4 py-3">
                                {customer.id}
                              </td>
                              <td
                                width="300"
                                className={`px-4 py-3 ${
                                  !customer.firstName ||
                                  customer.firstName.trim() === ""
                                    ? "empty-td"
                                    : ""
                                } `}
                              >
                                {customer.firstName}
                              </td>
                              <td width="300" className="px-4 py-3">
                                {customer.lastName}
                              </td>
                              <td
                                width="300"
                                className={`px-4 py-3 ${
                                  !customer.email ||
                                  customer.email.trim() === ""
                                    ? "empty-td"
                                    : ""
                                } `}
                              >
                                {customer.email}
                              </td>
                              <td width="300" className="px-4 py-3">
                                {customer.phone}
                              </td>
                              <td width="300" className="px-4 py-3">
                                2024-11-25
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="w-full p-6 flex flex-col items-start justify-center border border-t-0 rounded rounded-t-none">
                <FormInput
                  className="w-full relative uploadButton"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="w-full !h-full opacity-0 z-50"
                    onChange={handleFileChange}
                    key={inputKey}
                  />
                  <label
                    htmlFor="file"
                    className="absolute w-full h-full flex flex-col items-center justify-center"
                  >
                    {fileName ? (
                      <span className="fileDetails flex gap-3 items-center">
                        {fileName}
                        <button
                          onClick={handleDeleteFile}
                          className="z-50 hover:text-red-500 transition-all"
                        >
                          <FaRegTrashAlt size={16} />
                        </button>
                      </span>
                    ) : (
                      <GrCloudUpload size={28} />
                    )}

                    {error && <span>{error}</span>}
                  </label>
                </FormInput>
                <FormInput className="w-full csv_table mt-3">
                  <label htmlFor="file" className="p font-medium">
                    Required Fields For Uploading CSV
                  </label>
                  <ul className="w-full">
                    <li className="thead flex w-full gap-20 list_li">
                      <div className="text-left">Header</div>
                      <div className="text-left">Value</div>
                    </li>
                    <li className="list_li">
                      <div>firstName</div>
                      <div>The customer's first name</div>
                    </li>
                    <li className="list_li">
                      <div>lastName</div>
                      <div>The customer's last name</div>
                    </li>
                    <li className="list_li">
                      <div>email</div>
                      <div>The customer's email address</div>
                    </li>
                    <li className="list_li">
                      <div>Phone</div>
                      <div>The customer's phone number</div>
                    </li>
                    <li className="list_li">
                      <div>createdAt</div>
                      <div>Date of customer sign up</div>
                    </li>
                  </ul>
                </FormInput>
                <a
                  href="/default_sheet.csv"
                  download="default_sheet.csv"
                  className="w-full"
                >
                  <button
                    className={`bg-blue-500 text-white px-4 py-2 w-full !justify-center items-center gap-3 rounded hover:bg-blue-600`}
                  >
                    Download Sample
                    <FaDownload size={18} />
                  </button>
                </a>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitCsv}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Saving...
                    <TbLoaderQuarter size={18} className="loader inline ml-2" />
                  </>
                ) : afterLoading ? (
                  "Skip & Send"
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="thirdTab tab_modal">
            <div className="w-full p-6 flex flex-col items-start justify-center border border-t-0 rounded rounded-t-none">
              <FormInput className="w-full">
                <label htmlFor="button">
                  <h6 className="h6">App Connections</h6>
                </label>
                <button className="btn btn-outline w-full max-w-full mt-4">
                  Import from Zapier
                </button>
              </FormInput>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
