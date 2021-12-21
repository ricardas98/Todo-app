import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { updateAccessToken, setError, resetState } from "../../redux/dataSlice";

export const StayLoggedInForm = ({ close }) => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state.data.user.refreshToken);
  const username = useSelector((state) => state.data.user.username);

  async function refreshAccessToken() {
    const payload = {
      refreshToken: refreshToken,
    };

    try {
      await axios.post(`api/users/${username}/tokens`, payload).then((res) => {
        dispatch(updateAccessToken(res.data.accessToken));
        close();
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.data.Error));
        close();
        console.log({ err });
      }
      console.log({ err });
    }
  }

  function handleClose() {
    dispatch(resetState());
    close();
    window.location.replace("/");
  }

  return (
    <div className="form">
      <div className="formContent">
        <h3>Stay logged in?</h3>
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <div className="simpleForm">
          <button className="buttonRed mr-10" onClick={() => refreshAccessToken()}>
            Yes
          </button>
          <button className="buttonGrey" onClick={() => handleClose()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};
