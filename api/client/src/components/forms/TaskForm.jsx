import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { NameLength } from "../../ErrorMessages";
import { convertDate } from "../../functions/DataManipulation";
import { addTask, updateTask } from "../../redux/dataSlice";

export const TaskForm = ({ task, close }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);
  const categoriesAll = useSelector((state) => state.data.categories);

  const [name, setName] = useState(task?.name || "");
  const [date, setDate] = useState(task ? convertDate(task?.date) : convertDate(new Date()));
  const [categoriesChecked, setCategoriesChecked] = useState([]);

  let checked = null;
  const [expand, setExpand] = useState(false);

  const [error, setError] = useState();

  const handleChecked = (id) => {
    if (categoriesChecked.includes(id)) {
      const filteredCategories = categoriesChecked.filter((x) => x !== id);
      setCategoriesChecked(filteredCategories);
    } else {
      setCategoriesChecked([id, ...categoriesChecked]);
    }
  };

  const toggleExpand = () => {
    setExpand(!expand);
    checked = !checked;
    setCategoriesChecked([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError();
    if (name.length === 0) {
      setError(NameLength());
      return;
    }

    if (!task) {
      const payload = {
        name: name,
        date: date || convertDate(new Date()),
        categories: categoriesChecked,
      };

      try {
        await axios.post(`api/users/${username}/tasks`, payload).then((res) => {
          dispatch(addTask(res.data));
          setName("");
          setDate(convertDate(new Date()));
          checked = false;
          setCategoriesChecked([]);
          toggleExpand();
          setExpand(false);
        });
      } catch (err) {
        if (err.response?.status === 403) {
          setError(err.response.data.Error);
        }
      }
    } else {
      const payload = {
        name: name,
        date: date || convertDate(new Date()),
      };

      try {
        await axios.put(`api/users/${username}/tasks/${task._id}`, payload).then((res) => {
          dispatch(updateTask(res.data));
          close();
        });
      } catch (err) {
        if (err.response?.status === 403) {
          setError(err.response.data.Error);
        }
        console.log(err);
      }
    }
  };

  return (
    <div className="infoForm">
      <div className="infoFormContent">
        {task ? <h3>Edit task</h3> : <h3>New task</h3>}
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <form className="form" onSubmit={handleSubmit}>
          <input type="text" className="inputFieldText" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" className="inputFieldText" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
          {!task && (
            <>
              {expand ? (
                <>
                  <div className="verticalSpacer" />
                  <button className="buttonGrey" type="button" onClick={toggleExpand}>
                    Collapse Categories
                  </button>

                  <div className="inputCheckBoxList">
                    {categoriesAll?.map((x) => (
                      <div key={x._id} className="inputCheckBoxItem">
                        <label className="inputCheckBoxItemContent">
                          <input
                            type="checkbox"
                            value={x.id}
                            className="inputCheckBox"
                            onChange={() => handleChecked(x._id)}
                            checked={checked ? false : null}
                          />
                          {x.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                categoriesAll.length > 0 && (
                  <>
                    <div className="verticalSpacer" />
                    <button className="buttonGrey" type="button" onClick={toggleExpand}>
                      Expand Categories
                    </button>
                  </>
                )
              )}
            </>
          )}
          <div className="verticalSpacer" />
          <button className="buttonRed" type="submit">
            Save
          </button>
        </form>
        {error && (
          <>
            <div className="verticalSpacer" />
            <span className="errorMsg">{error}</span>
          </>
        )}
      </div>
    </div>
  );
};
