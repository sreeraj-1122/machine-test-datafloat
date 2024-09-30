import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Login = ({ onLogin, onRegisterClick }) => {

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    
  // Validation schema using Yup

    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters long"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
    }),
    onSubmit: (values) => {
      onLogin(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          {...formik.getFieldProps("username")}
          className={formik.touched.username && formik.errors.username ? "input-error" : ""}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className="error">{formik.errors.username}</div>
        ) : null}

        <input
          type="password"
          placeholder="Password"
          {...formik.getFieldProps("password")}
          className={formik.touched.password && formik.errors.password ? "input-error" : ""}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error">{formik.errors.password}</div>
        ) : null}

        <button type="submit">Login</button>
        <div>
          Don't have an account?{" "}
          <span className="register-link" onClick={onRegisterClick}>
            Register
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
