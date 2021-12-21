import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { CategoryCell } from "../categoryCell/CategoryCell";

import { setError, removeCategory, assignCategory } from "../../redux/dataSlice";

import "./Categories.css";

export const Categories = ({ task }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);

  let categoriesSelected = [];
  useSelector((state) => state.data.categories).map((x) => {
    if (task.categories?.includes(x._id)) {
      categoriesSelected = [...categoriesSelected, x];
    }
  });

  let categoriesNotSelected = [];
  useSelector((state) => state.data.categories).map((x) => {
    if (!task.categories?.includes(x._id)) {
      categoriesNotSelected = [...categoriesNotSelected, x];
    }
  });

  const handleAssign = async (id) => {
    let categories = [];
    task.categories.map((x) => {
      categories = [...categories, x];
    });
    const payload = {
      categories: [...categories, id],
    };

    try {
      await axios.put(`api/users/${username}/tasks/${task._id}`, payload).then(() => {
        dispatch(assignCategory({ categoryId: id, taskId: task._id }));
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  const handleRemove = async (id) => {
    let categories = [];
    task.categories.map((x) => {
      if (x !== id) {
        categories = [...categories, x];
      }
    });
    const payload = {
      categories: categories,
    };
    try {
      await axios.put(`api/users/${username}/tasks/${task._id}`, payload).then((res) => {
        dispatch(removeCategory({ categoryId: id, taskId: task._id }));
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  return (
    <div className="categories">
      <div className="categoriesContent">
        <h3>Edit task categories</h3>
        <div className="verticalSpacer" />
        <div className="categoriesSelected">
          <div className="verticalSpacer" />
          <div className="categoriesSelectedList">
            {categoriesSelected.map((x) => (
              <div key={x._id} className="categoriesItem">
                <span className="listItemIcon">
                  <button type="button" className="buttonTransparent" onClick={() => handleRemove(x._id)}>
                    <i className="fas fa-minus fa-lg"></i>
                  </button>
                </span>
                <CategoryCell category={x} />
              </div>
            ))}
          </div>
        </div>
        <div className="categoriesUnSelected">
          <div className="verticalSpacer" />
          <div className="categoriesSelectedList">
            {categoriesNotSelected.map((x) => (
              <div key={x._id} className="categoriesItem">
                <span className="listItemIcon">
                  <button type="button" className="buttonTransparent" onClick={() => handleAssign(x._id)}>
                    <i className="fas fa-plus fa-lg"></i>
                  </button>
                </span>
                <CategoryCell category={x} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
