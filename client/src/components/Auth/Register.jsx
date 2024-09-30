import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

function Register({ onRegister, onLoginClick }) {

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik for handling form state and validation
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onRegister(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="register-form">
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={
          formik.touched.username && formik.errors.username ? "input-error" : ""
        }
      />
      {formik.touched.username && formik.errors.username ? (
        <div className="error">{formik.errors.username}</div>
      ) : null}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={
          formik.touched.username && formik.errors.username ? "input-error" : ""
        }
      />
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={
          formik.touched.username && formik.errors.username ? "input-error" : ""
        }
      />
      {formik.touched.password && formik.errors.password ? (
        <div className="error">{formik.errors.password}</div>
      ) : null}

      <button type="submit" className="auth-btn">
        Register
      </button>

      <div>
        <div>
          Already have an account?{" "}
          <span onClick={onLoginClick} className="register-link">
            Login
          </span>
        </div>
      </div>
    </form>
  );
}

export default Register;
