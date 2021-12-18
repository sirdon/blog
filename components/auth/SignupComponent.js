import React, { useEffect, useState } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";
const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "amit",
    email: "amit@gmail.com",
    password: "meet@1234",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });
  const { name, email, password, error, loading, message, showForm } = values;
  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.table({ name, email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };
    signup(user)
      .then((data) => {
        console.log({ data });
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            loading: false,
            message: data.message,
            showForm: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };
  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    loading ? <div className="alert alert-info">{message}</div> : "";
  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        <button className="btn btn-primary">Signup</button>
      </form>
    );
  };
  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
    </>
  );
};

export default SignupComponent;
