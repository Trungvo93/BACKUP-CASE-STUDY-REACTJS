import axios from "axios";
export const getAction = (type, data) => {
  return {
    type: type,
    payload: data,
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        "https://637edb84cfdbfd9a63b87c1c.mockapi.io/users"
      );
      dispatch({
        type: "FECTH_USERS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      console.log("Error Fetching users: ", err);
    }
  };
};

export const getAvatars = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        "https://637edb84cfdbfd9a63b87c1c.mockapi.io/avatars"
      );
      dispatch({
        type: "FECTH_AVATAR_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      console.log("Error Fetching avatars: ", err);
    }
  };
};

export const getBooks = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        "https://637edb84cfdbfd9a63b87c1c.mockapi.io/books"
      );
      dispatch({
        type: "FECTH_BOOKS_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      console.log("Error Fetching books: ", err);
    }
  };
};

export const getBorrowAndReturn = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        "https://637edb84cfdbfd9a63b87c1c.mockapi.io/borrowandreturn"
      );
      const newList = [...res.data];
      res.data.map((item, index) => {
        const currentDate = new Date();
        if (
          Date.parse(currentDate.toString()) > Date.parse(item.dayReturn) &&
          item.dayReturned === ""
        ) {
          newList[index].status = "Expires";
          axios
            .put(
              `https://637edb84cfdbfd9a63b87c1c.mockapi.io/borrowandreturn/${item.id}`,
              { ...item, status: "Expires" }
            )
            .catch((err1) => {
              console.log("Error check expires: ", err1);
            });
        }
      });
      dispatch({
        type: "FECTH_BORROWANDRETURN_SUCCESS",
        payload: newList,
      });
    } catch (err) {
      console.log("Error Fetching books: ", err);
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    try {
      const res = await axios.delete(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/users/${id}`
      );
      dispatch(getUsers());
    } catch (err) {
      console.log("Error delete user: ", err);
    }
  };
};

export const deleteBook = (id) => {
  return async (dispatch) => {
    try {
      const res = await axios.delete(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/books/${id}`
      );
      dispatch(getBooks());
    } catch (err) {
      console.log("Error delete book: ", err);
    }
  };
};
export const addUser = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/users/`,
        payload
      );
      dispatch(getUsers());
    } catch (err) {
      console.log("Error add user: ", err);
    }
  };
};

export const addBook = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/books/`,
        payload
      );
      dispatch(getBooks());
    } catch (err) {
      console.log("Error add book: ", err);
    }
  };
};
export const addBorrowAndReturn = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/borrowandreturn/`,
        payload
      );
      dispatch(getBorrowAndReturn());
    } catch (err) {
      console.log("Error add borrow and return book: ", err);
    }
  };
};

export const updateUser = (id, item) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/users/${id}`,
        item
      );
      dispatch(getUsers());
    } catch (err) {
      console.log("Error update user: ", err);
    }
  };
};

export const updateBook = (id, item) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/books/${id}`,
        item
      );
      dispatch(getBooks());
    } catch (err) {
      console.log("Error update book: ", err);
    }
  };
};

export const updateBorrowAndReturn = (id, item) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(
        `https://637edb84cfdbfd9a63b87c1c.mockapi.io/borrowandreturn/${id}`,
        item
      );
      dispatch(getBorrowAndReturn());
    } catch (err) {
      console.log("Error update borrow and return book: ", err);
    }
  };
};
