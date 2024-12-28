import React, { useEffect, useState } from "react";
import { InnerLayout } from "../../layout/InnerLayout";
import { EditNav } from "../../components/Settings/EditNav";
import { FaStar } from "react-icons/fa";
import QRCode from "react-qr-code";
import { FormInput } from "../../components/Form/FormInput";
import { useParams } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { getLocation, getReviewPages, useQuery } from "wasp/client/operations";

export default function KioskReview() {
  const { data: user } = useAuth();
  const { id } = useParams();
  const { data: currentPage } = useQuery(getReviewPages, {
    organizationId: user?.organizationId,
  });
  const { data: showLocation } = useQuery(getLocation);
  const [formData, setFormData] = useState({
    locations: "",
  });
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const [logoColor, setLogoColor] = useState("#000000");
  const [colorBox, setColorBox] = useState("#000000");
  const [outputFormat, setOutputFormat] = useState("PNG");

  useEffect(() => {
    if (currentPage) {
      const reviewPage = currentPage.find((page) => page.id === parseInt(id));
      if (reviewPage) {
        setFormData({
          locations: reviewPage.locations?.[0]?.id || "",
        });
      }
    }
  }, [currentPage, id]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setLogoColor(value);
      setColorBox(value);
    } else {
      setColorBox(value);
    }
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setLogoColor(value);
    setColorBox(value);
  };

  const handleAddOptions = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      locations: selectedLocation,
    }));
  };

  const handleDownload = () => {
    const svgElement = document.querySelector(".qr-box svg");

    if (outputFormat === "SVG") {
      // Handle SVG download
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `QRCode-${id}.svg`;
      link.click();
    } else if (outputFormat === "PNG") {
      // Handle PNG download
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `QRCode-${id}.png`;
        link.click();
      };

      image.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
    }
  };

  return (
    <InnerLayout
      childHeader="Review Pages / qr code"
      ChildIcon={FaStar}
      Nav={EditNav}
    >
      <div className="w-full max-w-[48rem] flex flex-col pt-6 card-bg rounded-md border">
        <div className="w-full px-6 pb-5">
          <h2 className="h5">QR Code</h2>
        </div>
        <div className="input-fields flex flex-col items-start px-6 py-3 border-t">
          <FormInput className="md:w-1/2 w-full">
            <label htmlFor="qrColor">Color</label>
            <div className="w-full flex relative">
              <input
                type="text"
                id="logo-color"
                value={colorBox}
                onChange={handleTextChange}
                className={`w-auto h-10 !rounded-none p-2 !bg-transparent `}
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
            <label htmlFor="outPut">Output</label>
            <select
              name="qr-output"
              id="outPut"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="SVG">SVG</option>
              <option value="PNG">PNG</option>
            </select>
          </FormInput>
          <FormInput className="md:w-1/2 w-full mt-6">
            <label className="h6" htmlFor="reviewLink">
              Location
            </label>

            <select
              id="reviewLink"
              value={formData.locations || ""}
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
          <FormInput className={`qr-box bg-white p-4 md:w-1/2 w-full `}>
            <QRCode
              fgColor={logoColor}
              value={`${baseUrl}/review-pages/${id}?location=${encodeURIComponent(
                showLocation?.find((location) => location.id === parseInt(id))
                  ?.name || "Default Location"
              )}`}
            />
          </FormInput>
        </div>
        <FormInput className="w-full flex sm:items-end items-center p-3 m-0 border-t input-btn-div">
          <button
            type="button"
            onClick={handleDownload}
            className="btn btn-primary"
          >
            Download
          </button>
        </FormInput>
      </div>
    </InnerLayout>
  );
}
