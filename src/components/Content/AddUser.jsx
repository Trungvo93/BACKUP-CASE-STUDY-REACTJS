import React, { useEffect, useState } from "react";
import { getAction, addUser, getAvatars } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import "./AddUser.css";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useCookies } from "react-cookie";
const AddUser = () => {
  const [cookies] = useCookies();
  const [confirm, setConfirm] = useState(false);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [checkCode, setCheckCode] = useState(false);
  const avatars = useSelector((state) => state.avatars);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const date = new Date();
  useEffect(() => {
    dispatch(getAvatars());
  }, []);
  const [form, setForm] = useState({
    name: "",
    avatar:
      "https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_1.jpg",
    role: "admin",
    username: "",
    password: "",
    studentCode: "",
    schoolCode: "",
    email: "",
    birthday: "",
  });

  const [rePassword, setRePassword] = useState({
    repassword: "",
    errorPassword: "",
  });
  const formSchema = yup.object().shape({
    name: yup.string().required(),
    role: yup.string().required(),
    username: yup
      .string()
      .matches(
        /^[A-Za-z][A-Za-z0-9_]{5,29}$/,
        "Username can only contain allowed characters including: uppercase, lowercase, digits, underscore, dash and period. Username must start or end with a letter or number and must contain at least one letter. At least 6 characters"
      )
      .required(),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Passwords must be at least 8 characters in length, must contain a minimum of 1 case letter, a minimum of 1 numeric character and a minimum of 1 special character"
      )
      .required(),
    studentCode: yup
      .string()
      .matches(
        /^[A-Za-z][A-Za-z0-9_]{5,29}$/,
        "At least 6 characters, no spaces"
      ),
    schoolCode: yup
      .string()
      .matches(
        /^[A-Za-z][A-Za-z0-9_]{2,29}$/,
        "At least 3 characters, no spaces"
      ),
    birthday: yup.date().required(),
    email: yup.string().email().required(),
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setCheckCode("");
    if (e.target.name === "password") {
      if (
        rePassword.repassword !== e.target.value &&
        rePassword.repassword === ""
      ) {
        setRePassword({
          ...rePassword,
          errorPassword: "Password not correctly",
        });
      } else {
        setRePassword({
          ...rePassword,
          errorPassword: "",
        });
      }
    }
  };
  const checkRePassword = (e) => {
    rePassword.repassword = e.target.value;
    setRePassword({ ...rePassword });
    if (form.password !== "") {
      if (form.password !== e.target.value) {
        setRePassword({
          ...rePassword,
          errorPassword: "Password not correctly",
        });
      } else {
        setRePassword({
          ...rePassword,
          errorPassword: "",
        });
      }
    }
  };

  const handleClose = (e) => {
    setConfirm(false);
    if (e.target.value === "agree") {
      if (rePassword.repassword === form.password) {
        if (
          form.role !== "student" ||
          (form.role === "student" &&
            form.studentCode !== "" &&
            form.schoolCode !== "")
        ) {
          axios
            .get(`https://637edb84cfdbfd9a63b87c1c.mockapi.io/users`)
            .then((res) => {
              const found = res.data.findIndex(
                (e) => e.username === form.username
              );
              if (found === -1) {
                dispatch(addUser(form));
                setShow(true);
                setTimeout(() => {
                  navigate("/home/users");
                }, 1000);
              } else {
                setShowError(true);
              }
            });
        } else {
          setCheckCode(true);
        }
      } else {
        setRePassword({
          ...rePassword,
          errorPassword: "Password not correctly",
        });
      }
    }
  };
  const handleSubmit = () => {
    setConfirm(true);
  };
  if (cookies.role === "admin") {
    return (
      <div className="container mb-5">
        {/* Show popup Username existed */}
        <Toast
          onClose={() => setShowError(false)}
          show={showError}
          delay={3000}
          autohide
          className="toast-popup bg-danger text-white">
          <Toast.Header className="bg-danger text-white">
            <i className="bi bi-bug-fill fw-bold"></i>
            <strong className="ms-3 me-auto fw-bold">Error</strong>
          </Toast.Header>
          <Toast.Body>Username has existed</Toast.Body>
        </Toast>

        {/* Show popup must fill all  */}
        <Toast
          onClose={() => setCheckCode(false)}
          show={checkCode}
          delay={3000}
          autohide
          className="toast-popup bg-danger text-white">
          <Toast.Header className="bg-danger text-white">
            <i className="bi bi-bug-fill fw-bold"></i>
            <strong className="ms-3 me-auto fw-bold">Error</strong>
          </Toast.Header>
          <Toast.Body>You must fill Student Code and School Code</Toast.Body>
        </Toast>
        {/* Show popup add success */}
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
          className="toast-popup bg-success text-white">
          <Toast.Header className="bg-success text-white">
            <i className="bi bi-check-circle-fill fw-bold"></i>
            <strong className="ms-3 me-auto fw-bold">Success</strong>
          </Toast.Header>
          <Toast.Body>User has been create success!</Toast.Body>
        </Toast>
        <h3 className="my-4 py-2 text-center text-success fw-bold bg-warning rounded">
          ADD USER
        </h3>

        {/* Create user */}
        <Formik
          initialValues={form}
          enableReinitialize={true}
          validationSchema={formSchema}
          onSubmit={handleSubmit}>
          <Form className="">
            <div className="form-floating mb-3">
              <Field
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => handleChange(e)}
                className="form-control"
                placeholder="Your name"></Field>
              <label htmlFor="name" className="text-success">
                Your name
              </label>
            </div>
            <ErrorMessage
              component="div"
              name="name"
              className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
            <br />
            <div className="form-floating mb-3">
              <Field
                id="username"
                className="form-control"
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={(e) => handleChange(e)}></Field>
              <label htmlFor="username" className="text-success">
                Username
              </label>
            </div>
            <ErrorMessage
              component="div"
              name="username"
              className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
            <br />
            <div className="d-sm-flex gap-3">
              <div className="w-100">
                <div className="form-floating mb-3">
                  <Field
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    type="password"
                    onChange={(e) => handleChange(e)}></Field>
                  <label htmlFor="password" className="text-success">
                    Password
                  </label>
                </div>
                <ErrorMessage
                  component="div"
                  name="password"
                  className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
                <br />
              </div>
              <div className="w-100">
                <div className="form-floating mb-3">
                  <Field
                    id="repassword"
                    className="form-control"
                    placeholder="Re-password"
                    name="repassword"
                    type="password"
                    onChange={(e) => checkRePassword(e)}></Field>
                  <label htmlFor="repassword" className="text-success">
                    Re-password
                  </label>
                </div>
                <div className="text-capitalize fw-bold text-danger mt-3">
                  {rePassword.errorPassword}
                </div>
                <br />
              </div>
            </div>
            <div className="d-sm-flex gap-3">
              <div className="w-100">
                <div className="form-floating mb-3">
                  <Field
                    max={`${date.getFullYear() - 10}-01-01`}
                    type="date"
                    id="birthday"
                    className="form-control w-auto"
                    placeholder="Birthday"
                    name="birthday"
                    value={form.birthday}
                    onChange={(e) => handleChange(e)}></Field>
                  <label htmlFor="birthday" className="text-success">
                    Birthday
                  </label>
                </div>
                <ErrorMessage
                  component="div"
                  name="birthday"
                  className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
                <br />
              </div>
              <div className="w-100">
                <div className="form-floating mb-3">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => handleChange(e)}
                    className="form-control "
                    placeholder="Email"></Field>
                  <label htmlFor="email" className="text-success">
                    Email
                  </label>
                </div>
                <ErrorMessage
                  component="div"
                  name="email"
                  className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
                <br />
              </div>
            </div>

            {/* Choose role */}
            <div role="group" aria-labelledby="my-radio-group">
              <h5 className="fw-bold text-success">Choose role</h5>
              <label className="d-flex gap-2 role ">
                <Field
                  name="role"
                  value="admin"
                  type="radio"
                  onChange={(e) => handleChange(e)}></Field>
                <span>Admin</span>
              </label>
              <label className="d-flex gap-2 role ">
                <Field
                  name="role"
                  value="library"
                  type="radio"
                  onChange={(e) => handleChange(e)}></Field>
                <span>Library</span>
              </label>
              <label className="d-flex gap-2 role ">
                <Field
                  name="role"
                  value="student"
                  type="radio"
                  onChange={(e) => handleChange(e)}></Field>
                <span>Student</span>
              </label>
            </div>

            {form.role === "student" ? (
              <>
                <div className="form-floating mb-3">
                  <Field
                    id="studentCode"
                    className="form-control mt-3"
                    placeholder="Student Code"
                    name="studentCode"
                    onChange={(e) => handleChange(e)}></Field>
                  <label htmlFor="studentCode" className="text-success">
                    Student Code
                  </label>
                </div>
                <ErrorMessage
                  component="div"
                  name="studentCode"
                  className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>

                <div className="form-floating mb-3">
                  <Field
                    id="schoolCode"
                    className="form-control "
                    placeholder="School Code"
                    name="schoolCode"
                    onChange={(e) => handleChange(e)}></Field>
                  <label
                    htmlFor="studschoolCodeentCode"
                    className="text-success">
                    School Code
                  </label>
                </div>
                <ErrorMessage
                  component="div"
                  name="schoolCode"
                  className="text-capitalize fw-bold text-danger mt-3"></ErrorMessage>
              </>
            ) : (
              ""
            )}
            {/* Choose Avatar */}
            <div role="group" aria-labelledby="my-radio-group">
              <h5 className="fw-bold text-success mt-3">Choose Avatar</h5>
              {avatars.length > 0
                ? avatars.map((e, index) => (
                    <label className="pe-4 role" key={index}>
                      <Field
                        name="avatar"
                        value={e.avatar}
                        type="radio"
                        onChange={(e) => handleChange(e)}></Field>
                      <img
                        src={e.avatar}
                        alt=""
                        className="avatar rounded-circle ms-1"
                      />
                    </label>
                  ))
                : ""}
            </div>
            <br />
            <Button
              type="submit"
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onSubmit={handleSubmit}
              className="px-4 me-4 mb-3">
              Add
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={() => {
                navigate("/home/users");
              }}
              className="px-4 me-5 mb-3 shadow">
              Cancel
            </Button>

            {/* Show dialog confirm when click button Save */}
            <Dialog
              open={confirm}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to add?"}
              </DialogTitle>

              <DialogActions>
                <Button onClick={handleClose} value="cancel">
                  Disagree
                </Button>
                <Button onClick={handleClose} autoFocus value="agree">
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        </Formik>
      </div>
    );
  }
};

export default AddUser;
