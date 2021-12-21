import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { setError, addCategory } from "../../redux/dataSlice";
import { Category } from "../category/Category";

import { CategoryLength, CategoryLengthMax } from "../../ErrorMessages";

import "./Forms.css";

export const CategoryForm = ({ category }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);

  const [name, setName] = useState(category?.name || "");
  const [error, setErrorState] = useState();

  const categories = useSelector((state) => state.data.categories);

  if (!categories) {
    console.log("Empty");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState();

    if (!name) {
      setErrorState(CategoryLength());
      return;
    }

    if (name.length > 25) {
      setErrorState(CategoryLengthMax());
      return;
    }

    const payload = {
      name: name,
    };

    try {
      await axios.post(`api/users/${username}/categories`, payload).then((res) => {
        dispatch(addCategory(res.data));
        setName("");
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  return (
    <>
      <div className="categoryForm">
        <h3>Edit categories</h3>
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <div className="categoryFormContent">
          <form className="simpleForm" onSubmit={handleSubmit}>
            <input type="text" className="inputFieldText" placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="commentFormButton">
              <button className="buttonRed" type="submit">
                Create
              </button>
            </div>
          </form>
          {error && (
            <>
              <div className="verticalSpacer" />
              <span className="errorMsg">{error}</span>
            </>
          )}
          <div className="categoriesSelected">
            <div className="verticalSpacer" />
            {categories.map((x) => (
              <Category key={x._id} category={x} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
