import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "./Layout.css";
import Menu from "./leftBar/Menu";
import TopInfo from "./leftBar/TopInfo";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  getAvatars,
  getBooks,
  getBorrowAndReturn,
} from "./redux/actions";
import { NavLink } from "react-router-dom";
const Layout = () => {
  const [cookies, setCookie] = useCookies();
  const users = useSelector((state) => state.users);
  const [loginedUser, setLoginedUser] = useState({});
  const store = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let activeStyle = {
    color: `rgb(33, 43, 54)`,
    backgroundColor: `rgba(145, 158, 171, 0.16)`,
    fontWeight: "bold",
  };
  let noneActiveStyle = {
    color: `rgb(99, 115, 129)`,
  };
  const handleLogout = () => {
    setCookie("username", undefined, {
      path: "/",
    });
    setCookie("password", undefined, {
      path: "/",
    });
    setCookie("role", undefined, {
      path: "/",
    });
    navigate("/");
  };
  const handleBackLogin = () => {
    navigate("/");
  };
  useEffect(() => {
    dispatch(getUsers());
    // dispatch(getBooks());

    // dispatch(getAvatars());
    // dispatch(getBooks());
    // dispatch(getBorrowAndReturn());
    // console.log("reload");
  }, []);

  //Check afk for 3m
  useEffect(() => {
    const newCookie = {
      username: cookies.username,
      password: cookies.password,
      role: cookies.role,
    };
    setCookie("username", newCookie.username, {
      path: "/",
      maxAge: 180,
    });
    setCookie("password", newCookie.password, {
      path: "/",
      maxAge: 180,
    });
    setCookie("role", newCookie.role, {
      path: "/",
      maxAge: 180,
    });
    const infoLoginUser = users.find(
      (item) => item.username === cookies.username
    );
    setLoginedUser({ ...infoLoginUser });
  }, [store]);

  if (loginedUser.hasOwnProperty("username")) {
    return (
      <div className="container-fluid m-0">
        <div className="row">
          <div className="col-0 col-lg-1 col-xl-2 p-3  d-none d-lg-flex flex-column gap-3 border-dotted leftMenu">
            <TopInfo></TopInfo>
            <hr className=" d-none d-xl-block" />
            <Menu></Menu>
          </div>
          <div className="col-12 col-lg-11 col-xl-10 p-0 pb-2 bg-content ">
            <div className="sticky-top stickyTop d-flex justify-content-between align-items-center px-2 px-sm-5  shadow-sm">
              <div className="">
                <img
                  src={`${process.env.PUBLIC_URL}/images/logo_library.png`}
                  alt=""
                  className="logoLibrary "
                  onClick={() => {
                    navigate("/home/dashboard");
                  }}
                />
              </div>
              <div className="d-flex gap-md-5 gap-sm-2 gap-1 d-lg-none">
                <NavLink
                  to="dashboard"
                  className="d-flex gap-3 align-items-center text-decoration-none p-3 rounded-2 "
                  style={({ isActive }) =>
                    isActive ? activeStyle : noneActiveStyle
                  }>
                  <i className="bi bi-bar-chart flex-shrink-1"></i>
                  <p className="m-0  d-none d-xl-block">Dashboard</p>
                </NavLink>

                <NavLink
                  to="users"
                  className="d-flex gap-3 align-items-center text-decoration-none p-3 rounded-2 "
                  style={({ isActive }) =>
                    isActive ? activeStyle : noneActiveStyle
                  }>
                  <i className="bi bi-people flex-shrink-1"></i>
                  <p className="m-0  d-none d-xl-block">Users</p>
                </NavLink>

                <NavLink
                  to="products"
                  className="d-flex gap-3 align-items-center text-decoration-none p-3 rounded-2 "
                  style={({ isActive }) =>
                    isActive ? activeStyle : noneActiveStyle
                  }>
                  <i className="bi bi-journal-text flex-shrink-1"></i>
                  <p className="m-0  d-none d-xl-block">Products</p>
                </NavLink>
                <NavLink
                  to="borrowreturn"
                  className="d-flex gap-3 align-items-center text-decoration-none p-3 rounded-2"
                  style={({ isActive }) =>
                    isActive ? activeStyle : noneActiveStyle
                  }>
                  <i className="bi bi-basket flex-shrink-1"></i>
                  <p className="m-0  d-none d-xl-block">Borrow/Return</p>
                </NavLink>
              </div>
              <div className="logo">
                <div className="logoRound">
                  <img
                    // src={`${process.env.PUBLIC_URL}/images/ava-1.jpg`}
                    src={loginedUser.avatar ? loginedUser.avatar : ""}
                    alt=""
                    className="logoAva rounded-circle"
                  />
                </div>

                <div
                  className="gap-2 fw-bold logoPopup align-items-center rounded-3 "
                  onClick={handleLogout}>
                  <i className="bi bi-box-arrow-left"></i>
                  <p className="m-0">Logout</p>
                </div>
              </div>
            </div>

            <div className="container-lg mt-5 ">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container loaderPage">
        <div className="loader"></div>
        <div>
          <button
            className="btn btn-secondary back-login"
            onClick={handleBackLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }
};

export default Layout;
