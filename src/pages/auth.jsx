import { Link, useNavigate } from "react-router-dom";
// import LoginImg from "../assets/image/loginBg.jpg";
import signupImg from "../assets/image/signup-img.jpg";
import EduLogo from "../assets/svg/Logo";
import LogoText from "../assets/svg/LogoText";
import PropTypes from "prop-types";
import axios from "axios";
import { FormInput } from "../components/Form/FormInput";
import { useState } from "react";
import { meta } from "@eslint/js";

// Reusable Auth Wrapper
const AuthWrapper = ({
  children,
  imgValue,
  altValue,
  isSubmitted,
  successMessage,
}) => (
  <div
    className={`mx-auto w-full min-h-screen flex lg:flex-row flex-col items-center justify-center ${
      imgValue ? "container-fluid" : "container"
    }`}
  >
    <div
      id="innerWrapper"
      className={`flex flex-col justify-center max-w-[550px] items-center py-12 px-4 mx-auto rounded-md auth-wrapper ${
        !imgValue ? "lg:w-full" : "lg:w-1/2"
      }`}
    >
      <div className="flex review-logo">
        <EduLogo className="w-[30px] h-[30px]" />
        <LogoText className="w-fit h-[30px]" />
      </div>
      {/* Conditional rendering for success message or form */}
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            {successMessage}
          </h2>
          <p className="text-gray-600 mt-2">
            Please check your email to verify your account.
          </p>
        </div>
      ) : (
        children
      )}
    </div>
    {imgValue && (
      <div className="login_image lg:w-1/2">
        <img src={imgValue} alt={altValue} className="h-full w-full" />
      </div>
    )}
  </div>
);

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  imgValue: PropTypes.string,
  altValue: PropTypes.string,
  successMessage: PropTypes.string,
};

// Reusable Footer Text
const AuthFooter = ({ message, linkText, linkTo, className }) => (
  <span
    className={`text-[1rem] font-medium text-gray-900 inline-flex items-center gap-3 forgot-sec`}
  >
    {message}{" "}
    <Link className={`link-btn ${className}`} to={linkTo}>
      {linkText}
    </Link>
  </span>
);
AuthFooter.propTypes = {
  message: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkTo: PropTypes.string.isRequired,
  className: PropTypes.string,
};

// Components for different authentication pages
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message display
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://edu-server-z44l.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Store token in localStorage
        localStorage.setItem("authToken", token);

        // Navigate to the /settings route
        navigate("/settings");
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <AuthWrapper imgValue={signupImg} altValue="Login Image">
      <FormInput className="w-full">
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center">Login</button>
          {errorMessage && (
            <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
          )}
        </form>
      </FormInput>
      <AuthFooter
        message="Dont have an account?"
        className="text-[#1D4ED8] underline"
        linkText="sign up"
        linkTo="/signup"
      />
      <AuthFooter
        message="Forgot your password?"
        className="text-[#1D4ED8] underline"
        linkText="Reset Password"
        linkTo="/forgot-password"
      />
    </AuthWrapper>
  );
};

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if the form is submitted

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://edu-server-z44l.onrender.com/auth/signup", {
        email,
        password,
      });
      setIsSubmitted(true); // Show the success message
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper imgValue={signupImg} altValue="Signup Image">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            Email Verification Sent
          </h2>
          <p className="text-gray-600 mt-2">
            Please check your email to verify your account.
          </p>
        </div>
      ) : (
        <FormInput className="w-full">
          <form onSubmit={handleSignup}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="border rounded-md p-2 w-full mb-4"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="border rounded-md p-2 w-full mb-4"
            />
            <input
              type="password"
              name="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="border rounded-md p-2 w-full mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
        </FormInput>
      )}
      <br />
      {!isSubmitted && (
        <AuthFooter
          message="Already have an account?"
          className="text-[#1D4ED8] underline"
          linkText="Login"
          linkTo="/login"
        />
      )}
    </AuthWrapper>
  );
};

// export const EmailVerification = () => (
//   <AuthWrapper>
//     <VerifyEmailForm />
//     <br />
//     <AuthFooter
//       message="If everything is okay,"
//       linkText="Go to Login"
//       linkTo="/login"
//     />
//   </AuthWrapper>
// );

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add your forgot password logic here
    console.log("Forgot Password Request:", { email });
  };
  return (
    <AuthWrapper>
      <FormInput className="w-full">
        <form onSubmit={handleForgotPassword}>
          <h2>Forgot Password</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button type="submit">Send Reset Link</button>
        </form>
      </FormInput>
      <br />
      <AuthFooter
        message="Back to"
        className="text-[#1D4ED8] underline"
        linkText="Login"
        linkTo="/login"
      />
    </AuthWrapper>
  );
};

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add your reset password logic here
    console.log("Password Reset:", { password });
  };
  return (
    <AuthWrapper>
      <FormInput className="w-full">
        <form onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
          <button type="submit">Reset Password</button>
        </form>
      </FormInput>
      <br />
      <AuthFooter
        message="If everything is okay,"
        className="text-[#1D4ED8] underline"
        linkText="Go to Login"
        linkTo="/login"
      />
    </AuthWrapper>
  );
};
