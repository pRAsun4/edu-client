import React from "react";
import { InnerLayout } from "../../layout/InnerLayout";
import { EditNav } from "../../components/Settings/EditNav";
import { FaStar } from "react-icons/fa";
import { FaLinkSlash } from "react-icons/fa6";
import { FormInput } from "../../components/Form/FormInput";

export default function LinkReviewPages() {
  return (
    <InnerLayout
      childHeader="Review Pages/Link page"
      ChildIcon={FaStar}
      Nav={EditNav}
    >
      <div className="w-full max-w-[48rem] flex flex-col pt-6 card-bg rounded-md border">
        <div className="w-full px-6 pb-5">
          <h2 className="h5">Links</h2>
        </div>
        <div className="input-fields flex flex-col items-start p-6  border-t">
          <div className="w-full flex flex-col items-center justify-center p-12 rounded-md  border">
            <div
              className="link-icon-box w-[6.25rem] h-[6.25rem] rounded-full flex items-center justify-center border"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <FaLinkSlash size={24} />
            </div>
            <h2 className="h5 mt-4">No Links</h2>
            <h4 className="h6 mt-4">
              Add buttons to your page to leave reviews on 3rd party websites.
            </h4>
          </div>
          <FormInput className="w-full flex sm:items-end items-center p-3 pb-0 mt-4 m-0 input-btn-div">
            <button type="button" className="btn btn-primary">
              Save
            </button>
          </FormInput>
        </div>
      </div>

      <div className="w-full max-w-[48rem] flex flex-col pt-6 mt-8 card-bg rounded-md border">
        <div className="w-full px-6 pb-5">
          <h2 className="h5">Link Options</h2>
        </div>
        <div className="input-fields flex flex-col items-start p-6  border-t">
          <div className="w-full flex flex-col items-start ">
            <FormInput>
              <label htmlFor="">Link Reveal Rating</label>
              <select name="rating-select" id="rating">
                <option value="value-1">Good</option>
                <option value="value-2">Bad</option>
              </select>
              <p className="">Reveal links if customers pick this rating or higher. Otherwise, a button to reveal links will be shown.</p>
            </FormInput>
            <FormInput>
              <label htmlFor="revel">Link Reveal Label </label>
              <input type="text" id="revelReviewLable" placeholder="Write a public review" />
              <p className="">The label to reveal links.</p>
            </FormInput>
            <FormInput>
              <label htmlFor="">Link Reveal Timing</label>
              <select name="rating-select" id="ratingTiming">
                <option value="value-1">Revel after rating selectino</option>
                <option value="value-2">Revel after review submittion</option>
              </select>
              <p className="">When to reveal links.</p>
            </FormInput>
            <FormInput>
              <label htmlFor="">Link Reveal Button</label>
              <select name="rating-select" id="ratingTiming">
                <option value="value-1">Enable Reveler</option>
                <option value="value-2">Disable Reveler (not suggested) </option>
              </select>
              <p className="">Preventing customers from leaving public reviews can get your 3rd party listings removed.</p>
            </FormInput>
          </div>
        </div>
          <FormInput className="w-full flex sm:items-end items-center p-3 border-t mt-4 m-0 input-btn-div">
            <button type="button" className="btn btn-primary">
              Save
            </button>
          </FormInput>
      </div>
    </InnerLayout>
  );
}
