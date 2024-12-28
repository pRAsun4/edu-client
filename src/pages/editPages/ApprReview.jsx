import React, { useEffect, useState } from "react";
import SettingsReview from "./SettingsReview";
import { FormInput } from "../../components/Form/FormInput";
import DefaultAppear from "../../assets/svg/DefaultAppear";
import SplitAppear from "../../assets/svg/SplitAppear";
import { GoPlus } from "react-icons/go";
import { FiX } from "react-icons/fi";
import { InnerLayout } from "../../layout/InnerLayout";
import { EditNav } from "../../components/Settings/EditNav";
import { FaStar } from "react-icons/fa";
import {
  getReviewInfo,
  updateReviewInfo,
  useQuery,
} from "wasp/client/operations";
import { useParams } from "react-router-dom";
export default function ApprReview() {
  const { id } = useParams();
  const { data: currentPageInfo } = useQuery(getReviewInfo, {
    reviewPageId: parseInt(id),
  });
  const items = [
    {
      label: "Default",
      IconComponent: DefaultAppear,
      isRotated: false,
      name: "layout",
      id: "DEFAULT",
    },
    {
      label: "Split",
      IconComponent: SplitAppear,
      isRotated: false,
      name: "layout",
      id: "SPLIT",
    },
    {
      label: "Split 2",
      IconComponent: SplitAppear,
      isRotated: true,
      name: "layout",
      id: "SPLIT_2",
    },
  ];
  const [selectedId, setSelectedId] = useState(null);
  const [logoColor, setLogoColor] = useState("#ffffff");
  const [colorBox, setColorBox] = useState("#000000");
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (currentPageInfo?.layout) {
      setAppFormData((prevData) => ({
        ...prevData,
        layout: currentPageInfo.layout,
      }));
    }

    console.log(currentPageInfo, "page info");
  }, [currentPageInfo]);


  const [appFormData, setAppFormData] = useState({
    layout: currentPageInfo?.layout || "",
    bgColor: currentPageInfo?.backgroundColor || "#ffffff",
    bgImage: currentPageInfo?.bgImage || null,
  });

  const handleSelectLayout = (id) => {
    setAppFormData((prevData) => ({
      ...prevData,
      layout: prevData.layout === id ? "" : id,
    }));
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setLogoColor(value);
    setColorBox(value);
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setAppFormData((prevData) => ({
      ...prevData,
      bgColor: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAppFormData((prevData) => ({
        ...prevData,
        bgImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setAppFormData((prevData) => ({
      ...prevData,
      bgImage: null,
    }));
  };

  const handleSave = async () => {
    try {
      const updateArgs = {
        id: parseInt(id),
        layout: appFormData.layout,
        reviewPageId: parseInt(id),
        backgroundColor: appFormData.bgColor,
        createdAt: currentPageInfo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await updateReviewInfo(updateArgs);
      console.log("Update Successful:", result);
    } catch (error) {
      console.error("Error updating review info:", error);
    }
  };

  const CheckBoxItem = ({
    label,
    IconComponent,
    isRotated,
    name,
    id,
    isChecked,
    onClick,
  }) => (
    <div
      className="check-box flex flex-col items-center justify-center cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div
        className="svg-box w-[4.375rem] h-[4.375rem] flex justify-center items-center border"
        style={{ backgroundColor: "var(--body-background)" }}
      >
        <span className={isRotated ? "rotate-180" : ""}>
          <IconComponent />
        </span>
      </div>
      <p>{label}</p>
      <input
        type="checkbox"
        name={name}
        id={id}
        className="!w-4 !h-4 cursor-pointer"
        checked={isChecked}
        readOnly
      />
    </div>
  );

  return (
    <InnerLayout childHeader="Review Pages" ChildIcon={FaStar} Nav={EditNav}>
      <div className="max-w-3xl w-full h-auto flex flex-col rounded-md border card-bg">
        <div className="w-full px-6 py-5">
          <h2 className="h5">Template</h2>
        </div>
        <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
          <FormInput>
            <label htmlFor="name">Layout</label>
            <div
              className="w-auto p-4 gap-4 flex items-center rounded-md border"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              {items.map(({ label, IconComponent, isRotated, name, id }) => (
                <CheckBoxItem
                  key={id}
                  label={label}
                  IconComponent={IconComponent}
                  isRotated={isRotated}
                  name={name}
                  id={id}
                  isChecked={appFormData.layout === id}
                  onClick={handleSelectLayout}
                />
              ))}
            </div>
          </FormInput>
          <FormInput className="md:w-1/2 w-full">
            <label htmlFor="logo-color" className="logo-color-label">
              Background Color
            </label>
            <div className="w-full flex relative">
              <input
                type="text"
                id="logo-color"
                value={colorBox}
                onChange={handleTextChange}
                className="w-auto h-10 !rounded-none p-2 !bg-transparent"
              />
              <div className="absolute right-0 top-0 w-[4rem] p-2 h-full rounded-md overflow-hidden">
                <input
                  type="color"
                  value={logoColor}
                  onChange={handleColorChange}
                  className="w-full !h-full block !bg-transparent !rounded-md !border-none cursor-pointer !p-0"
                />
              </div>
            </div>
          </FormInput>
          <FormInput className="md:w-1/2 w-full">
            <label htmlFor="background_image" className="block mb-2">
              Background Image
            </label>
            <div className="w-full max-w-[13.25rem] h-[13.25rem] flex items-center rounded-md relative p-2 border overflow-hidden">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Uploaded background"
                    className="w-full h-[50%] object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 cursor-pointer z-10 border"
                  >
                    <FiX size={16} />
                  </button>
                </>
              ) : (
                <div className="uploader-loader flex w-full h-full justify-center items-center bg-[#4444]">
                  <GoPlus size={24} />
                </div>
              )}
              <input
                type="file"
                name="background-image"
                id="bg_img"
                className="w-full !h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </FormInput>
        </div>
        <FormInput className="w-full flex sm:items-end items-center p-4 m-0 border-t input-btn-div ">
          <button
            type="button"
            onClick={handleSave}
            className=" btn btn-primary"
          >
            Save
          </button>
        </FormInput>
      </div>
    </InnerLayout>
  );
}
