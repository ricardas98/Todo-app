import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";

import { deleteCategory, updateCategory } from "../../redux/dataSlice";

import { CategoryLength, CategoryLengthMax } from "../../ErrorMessages";

export const Category = ({ category }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(category.name);

  const [error, setError] = useState();

  const handleDelete = async () => {
    try {
      await axios.delete(`api/users/${username}/categories/${category._id}`).then((res) => {
        dispatch(deleteCategory(category._id));
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  const toggleEdit = () => {
    setEdit(!edit);
    if (edit) setName("");
    else setName(category.name);
  };

  const handleEdit = async () => {
    setError();
    if (name?.length === 0) {
      setError(CategoryLength());
      return;
    }

    if (name?.length > 25) {
      setError(CategoryLengthMax());
      return;
    }

    if (name === category.name) {
      toggleEdit();
    }

    const payload = {
      name: name,
    };

    try {
      await axios.put(`api/users/${username}/categories/${category._id}`, payload).then((res) => {
        dispatch(updateCategory(res.data));
        toggleEdit();
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
    }
  };

  return (
    <div className="listItem">
      <div className="listItemContent">
        {!edit ? (
          <>
            <div className="listItemContentLeft">
              <span className="listItemContentText">{category.name}</span>
            </div>
            <div className="listItemContentRight">
              <span className="listItemIcon">
                <button className="buttonTransparent" onClick={toggleEdit}>
                  <i className="fas fa-pen fa-sm"></i>
                </button>
              </span>
              <span className="listItemIcon">
                <button className="buttonTransparent" onClick={handleDelete}>
                  <i className="fas fa-times fa-lg"></i>
                </button>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="listItemContentLeft">
              <span className="listItemContentText">
                <input
                  className="listItemTextEditInput"
                  type="text"
                  value={name}
                  placeholder="Can't be empty"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </span>
              {error && (
                <>
                  <div className="verticalSpacer" />
                  <span className="errorMsg">{error}</span>
                </>
              )}
            </div>
            <div className="listItemContentRight">
              <span className="listItemIcon">
                <button className="buttonTransparent" onClick={handleEdit}>
                  <i className="fas fa-check fa-lg"></i>
                </button>
              </span>
              <span className="listItemIcon">
                <button className="buttonTransparent" onClick={toggleEdit}>
                  <i className="fas fa-times fa-lg"></i>
                </button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
