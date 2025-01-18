import { Link } from "react-router-dom";
import LoginImg from "../assets/image/loginBg.jpg";
import loginFront from "../assets/image/loginContent.png";
import EduLogo from "../assets/svg/Logo";
import LogoText from "../assets/svg/LogoText";
import PropTypes from "prop-types";
import { FormInput } from "../components/Form/FormInput";
import { useState } from "react";

// Reusable Auth Wrapper
const AuthWrapper = ({ children, imgValue, altValue }) => (
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
      {children}
    </div>
    {imgValue && (
      <div
        className="login_image lg:w-1/2"
        style={{
          backgroundImage: `url(${imgValue})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <img src={loginFront} alt={altValue} className="h-full w-full" />
      </div>
    )}
  </div>
);

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  imgValue: PropTypes.string,
  altValue: PropTypes.string,
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
  

  const handleLogin = () => {
    // Login logic using email and password
    console.log("Login:", { email, password });
  };
  return (
    <AuthWrapper imgValue={LoginImg} altValue="Login Image">
      {/* <LoginForm /> */}
      <FormInput className='w-full'>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </FormInput>
      <br />
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

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", { email, password });
  };

  return (
    <AuthWrapper imgValue={LoginImg} altValue="Signup Image">
      <FormInput className='w-full'>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit">Signup</button>
        </form>
      </FormInput>
      <br />
      <AuthFooter
        message="Already have an account?"
        className="text-[#1D4ED8] underline"
        linkText="Login"
        linkTo="/login"
      />
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
      <FormInput className='w-full'>
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
      <FormInput className='w-full'>
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
