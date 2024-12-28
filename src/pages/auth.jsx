import React, { useEffect } from "react";
import {
  LoginForm,
  VerifyEmailForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  SignupForm,
} from "wasp/client/auth";
import { Link } from "react-router-dom";
import LoginImg from "../assets/image/loginBg.jpg";
import loginFront from '../assets/image/loginContent.png'
import ReviewLogo from "../assets/svg/ReviewLogo";
import LogoText from "../assets/svg/LogoText";

const withH2Logger = (Component, customTitle) => {
  return (props) => {
    useEffect(() => {
      const innerWrapper = document.getElementById('innerWrapper')
      const h2Elements = innerWrapper.querySelectorAll("h2");

      h2Elements.forEach((h2) => {
        h2.textContent = customTitle;
      });
    }, []); 

    return <Component {...props} />;
  };
};



// Reusable Auth Wrapper
const AuthWrapper = ({ children, imgValue, altValue }) => (
  <div
    className={`mx-auto w-full min-h-screen flex lg:flex-row flex-col items-center justify-center ${imgValue ? "container-fluid" : "container"
      }`}
  >
    <div
      id="innerWrapper"
      className={`flex flex-col justify-center max-w-[550px] items-center py-12 px-4 mx-auto rounded-md auth-wrapper ${!imgValue ? "lg:w-full" : "lg:w-1/2"
        }`}
    >
      <div className="flex review-logo">
        <ReviewLogo className=" w-[30px] h-[30px] " />
        <LogoText className=" w-fit h-[30px] " />
      </div>
      {children}
    </div>
    {imgValue && (
      <div className="login_image lg:w-1/2" style={{backgroundImage:`url(${imgValue})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <img src={loginFront} alt={altValue} className="h-full w-full" />
      </div>
    )}
  </div>
);
export const appearance = {
  colors: {
    brand: "#4E60FF", 
    brandAccent: "#4151DD", 
    submitButtonText: "white",
  },
};
// Reusable Footer Text
const AuthFooter = ({ message, linkText, linkTo, className }) => (
  <span
    className={`text-[1rem] font-medium text-gray-900 inline-flex items-center gap-3 forgot-sec`}
  >
    {message}{" "}
    <Link className={`link-btn ${className} `} to={linkTo}>
      {linkText}
    </Link>
  </span>
);
export const Login = withH2Logger(() => (
  <AuthWrapper imgValue={LoginImg} imgFront={loginFront} altValue="Login Image">
    <LoginForm appearance={appearance} />
    <br />
    <AuthFooter
      message="Forgot your password?"
      className="text-[#1D4ED8] underline"
      linkText="Reset Password"
      linkTo="/request-password-reset"
    />
  </AuthWrapper>
), "Log Into your account");

export const Signup = withH2Logger(() => (
  <AuthWrapper>
    <SignupForm appearance={appearance} />
    <br />
    <AuthFooter
      message="Already have an account?"
      className="text-[#1D4ED8] underline"
      linkText="Login"
      linkTo="/login"
    />
  </AuthWrapper>
), "this is signup page");

export const EmailVerification = withH2Logger(() => (
  <AuthWrapper>
    <VerifyEmailForm appearance={appearance} />
    <br />
    <AuthFooter
      message="If everything is okay,"
      linkText="go to login"
      linkTo="/login"
    />
  </AuthWrapper>
), "this is email verification page");

export const RequestPasswordReset = withH2Logger(() => (
  <AuthWrapper>
    <ForgotPasswordForm appearance={appearance} />
    <br />
    <AuthFooter
      message="Back to"
      className="text-[#1D4ED8] underline"
      linkText="Login"
      linkTo="/login"
    />
  </AuthWrapper>
), "Forgot Your password?");

export const PasswordReset = withH2Logger(() => (
  <AuthWrapper>
    <ResetPasswordForm appearance={appearance} />
    <br />
    <AuthFooter
      message="If everything is okay,"
      className="text-[#1D4ED8] underline"
      linkText="go to login"
      linkTo="/login"
    />
  </AuthWrapper>
), "this is reset password page");