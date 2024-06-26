import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArrowLeft from "../../assets/arrow-left.svg";
import "../Signin/Signin.css";
import "../Signup/Signup.css";
import { FormInput } from "../Signup/Signup";
import { FormButton } from "../Signup/Signup";
import SigninBg from "../../assets/SigninBg.png";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/appContext";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import { Rings } from "react-loader-spinner";

const SignIn = () => {
  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
  const { forgotPassActive, setForgotPassActive } = useGlobalContext();
  const { currentScreen, setCurrentScreen } = useGlobalContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const [loadSignIn, setLoadSignIn] = useState(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const toggleForgotPassword = () => {
    setForgotPassActive(!forgotPassActive);
    setCurrentScreen(1);
    console.log("clc forgot pass");
  };

  useEffect(() => {
    const anyEmptyField = Object.values(signInData).some(
      (field) => field === ""
    );
    setIsDisabled(anyEmptyField);
  }, [signInData]);

  const handleChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });

    if (signInData.email !== "" && signInData.password !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();

    try {
      setLoadSignIn(true);
      const response = await fetch(
        "https://lms-k-be-12.onrender.com/api/user/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signInData),
        }
      );

      const data = await response.json();
      console.log(response.ok);

      if (response.ok) {
        toast.success("Signed in successfully!");
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 5000);
      } else {
        toast.error(data.message);
      }
      setLoadSignIn(false);
    } catch (error) {
      console.log(error);
      setLoadSignIn(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        theme="light"
        transition:Slide
      />
      {loadSignIn && (
        <div className="overlay">
          <Rings
            height={80}
            width={80}
            color="#4fa94d"
            visible={true}
            secondaryColor="#4fa94d"
            strokeWidth={3}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      <section className="signin">
        <div className="left">
          <img className="signin-bg" src={SigninBg} alt="" />
          <Link to="/signup">
            <img className="arrow-left" src={ArrowLeft} alt="left arrow" />
          </Link>
          <div className="logo-container">
            {/* <img className="logo" src={Logo} alt="kidera logo" /> */}
          </div>
        </div>
        <div className="right">
          <div className="signup--form-title">
            <h3>Sign In</h3>
            <div>
              <p>Unlock exciting adventures!</p>
              <p>Sign in today</p>
            </div>
          </div>

          <div className="form--container">
            <form action="" onSubmit={signIn}>
              <FormInput
                for="email"
                type="email"
                name="email"
                value={signInData.email}
                id="email"
                placeholder="example@gmail.com"
                title="Email Address"
                onChange={handleChange}
              />

              <FormInput
                for="password"
                type="password"
                name="password"
                value={signInData.password}
                id="password"
                placeholder="***********"
                title="Password"
                onChange={handleChange}
              />

              <FormButton text="Sign In" disabled={isDisabled} />
            </form>

            <div>
              <div className="signup--extras">
                <div className="terms--container">
                  <input type="checkbox" name="" id="" />
                  <p className="terms">Remember Me</p>
                </div>
                <p className="forgot-pass" onClick={toggleForgotPassword}>
                  Forgot Password?
                </p>
              </div>
              <div className="form-footer">
                <h3 style={{ color: "#6C6B6B" }}>
                  Don't have an account?{" "}
                  <Link to="/signup">
                    <span className="signin-text">Sign up</span>
                  </Link>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <ForgotPassword />
      </section>
    </>
  );
};

export default SignIn;
