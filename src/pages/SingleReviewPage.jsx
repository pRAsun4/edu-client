import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useQuery,
  getReviewPage,
  generateReview,
  getOrganization,
  getMedia,
  getSources,
} from "wasp/client/operations";
import { FormInput } from "../components/Form/FormInput";
import YellowStar from "../assets/svg/YellowStar";
import BlankStar from "../assets/svg/BlankStar";
import { AvatarFunc } from "../utils/Functions";
import { useAuth } from "wasp/client/auth";
import ExpertLogo from "../assets/customers/expert-mri/expert-logo.jpg";
import { useSelector } from "react-redux";

export const SingleReviewPage = () => {
  const { id } = useParams();
  const { data: user } = useAuth();
  if (!id) return <div>Page not found</div>;

  // Fetch the page details
  const {
    data: page,
    isLoading,
    isError,
  } = useQuery(getReviewPage, { id: Number(id) });

  const { data: appLogo } = useQuery(getMedia, { id: 1 });
  const { data: allSources } = useQuery(getSources, { organizationId: user?.organizationId});
  // const { data:  }
  const locationData = useSelector((state) => state.user.reviewLocationData );

  useEffect(() => {
    console.log("Updated reviewLocationData:", locationData.locationId);
  }, [locationData]);

  // Get the current URL search string (the query part after ?)
  // const { search } = useLocation();
  // const queryParams = new URLSearchParams(search);
  // const locationName = queryParams.get("location");
  // const decodedLocationName = decodeURIComponent(locationName);

  // Fetch the organization details once the page is loaded
  const {
    data: organization,
    isLoading: isLoadingOrg,
    isError: isErrorOrg,
    refetch,
  } = useQuery(
    getOrganization,
    { id: page?.organizationId },
    { enabled: !!page }
  );

  const [rating, setRating] = useState(null);
  const [currentLocationId, setCurrentLocationId] = useState(locationData.locationId);
  const [afterSubmit, setAfterSubmit] = useState();
  const [hoverRating, setHoverRating] = useState(null); // Track hover state  
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  // State to track if the form has been submitted with a rating above 4
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleRatingClick = (star) => setRating(star);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      rating,
      ...formData,
      currentLocationId,
      currentReviewPageId: parseInt(id),
      organizationId: page.organizationId,
    };


    try {
      await generateReview(requestData);
      setAfterSubmit(true);
      setRating(null);
      setFormData({ firstName: "", email: "", phone: "", message: "" });

      // If the rating is 4 or above, set the state to display sources
      if (rating >= 4) {
        setRatingSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("There was an error submitting your review. Please try again.");
    }
  };

  if (isLoading || isLoadingOrg) return <div>Loading page...</div>;
  if (isError || isErrorOrg)
    return <div>Error loading page or organization</div>;

  // Filter sources with a valid link
  const validSources =
    organization?.sources?.filter((source) => source.link) || [];

  return (
    <main className="!ml-0 !w-full">
      <section className="min-h-screen flex items-center justify-center bg-[#CBDCEB] px-6 py-20">
        <div className="max-w-[45rem] w-full px-4 md:px-28 py-8 md:py-14 bg-[#fff] rounded-lg   mx-auto">
          {afterSubmit ? (
            <h5 className="text-center !font-bold">
              Thank you for your response
            </h5>
          ) : (
            <div className="flex flex-col items-center justify-center gap-5 text-center">
              <div className="avatar w-full flex flex-col items-center justify-center ">
                <div
                  className={` ${
                    appLogo ? "w-[6.25rem] h-[6.25rem]" : "w-[10rem] h-auto"
                  } rounded-full flex items-center justify-center  overflow-hidden  `}
                >
                  <img
                    src={
                      appLogo
                        ? appLogo.imageUrl
                        : !appLogo
                        ? ExpertLogo
                        : AvatarFunc(page.title)
                    }
                    alt={`${page.title}-image`}
                  />
                </div>
                <h2 className="mb-3 mt-5 h4">{page.title}</h2>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: page.body }}
                />
              </div>

              <div className="rating">
                <ul className="flex items-center justify-between gap-6 mt-5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const labels = ["Terrible", "Bad", "Ok", "Good", "Great"];
                    return (
                      <li
                        className="text-3xl cursor-pointer flex flex-col items-center min-w-[64px]"
                        key={star}
                      >
                        <span
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                        >
                          {star <= (hoverRating || rating) ? (
                            <YellowStar />
                          ) : (
                            <BlankStar />
                          )}
                        </span>

                        <span className="text-sm mt-4 min-h-6">
                          {labels[star - 1]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {rating && (
                <form onSubmit={handleSubmit} className="mt-5 w-full">
                  <FormInput>
                    <label htmlFor="input" className="p">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Your Name..."
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </FormInput>
                  <FormInput>
                    <label htmlFor="input" className="p">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email..."
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormInput>
                  <FormInput>
                    <label htmlFor="input" className="p">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone..."
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </FormInput>
                  <FormInput>
                    <label htmlFor="input" className="p">
                      Write a review *
                    </label>
                    <textarea
                      name="message"
                      placeholder="Your Review...."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                    />
                  </FormInput>
                  <button
                    type="submit"
                    className="mt-8 btn btn-primary w-full max-w-full "
                    style={{ backgroundColor: "#1D4ED8", color: "#fff" }}
                  >
                    {page.buttonLabel}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Display sources only after rating is submitted and above 4 stars */}
          {ratingSubmitted && validSources.length > 0 && (
            <div className="mt-10 max-w-lg mx-auto">
              <ul className="flex flex-col items-center gap-4">
                {validSources.map((source) => (
                  <li key={source.id} className="w-fit">
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!text-white !bg-gray-500 hover:underline flex items-center justify-center gap-5 px-10 py-3 rounded-md w-full"
                    >
                      <img
                        src={source.iconUrl}
                        alt={source.name}
                        className="w-10 h-10"
                      />
                      <span className="flex items-center gap-3">
                        Review on {source.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
