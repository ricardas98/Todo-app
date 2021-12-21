import jwt_decode from "jwt-decode";

export function IsUserValid() {
  const error = JSON.parse(localStorage.getItem("state")).data.user.error || false;
  const accessToken = JSON.parse(localStorage.getItem("state")).data.user.accessToken || null;

  let result;
  if (!accessToken && !error) result = false;
  else if (!accessToken && error) result = false;
  else if (accessToken && error) result = false;
  else result = true;

  return result;
}

export function IsUserAdmin() {
  const accessToken = JSON.parse(localStorage.getItem("state")).data.user.accessToken || null;
  if (accessToken) {
    const decodedToken = jwt_decode(accessToken);
    if (decodedToken.role === "admin") return true;
  }
  return false;
}

export function IsTokenCloseToExpiration() {
  const accessTokenDate = JSON.parse(localStorage.getItem("state")).data.user.accessTokenDate || null;
  if (accessTokenDate) {
    if ((Date.now() - accessTokenDate) / 1000 / 60 > 10) {
      return true;
    } else {
      return false;
    }
  }
}
