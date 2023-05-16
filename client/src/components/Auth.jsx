import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookies, setcookie, removeCookie] = useCookies(null);
  const [Islogin, setIslogin] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  console.log(email, password, confirmPassword);

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!Islogin && password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    console.log(import.meta.env.VITE_REACT_APP_SERVERURL);

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.detail) {
      setError(data.detail);
    } else {
      setcookie("email", data.email);
      setcookie("authToken", data.token);
      window.location.reload();
    }
  };

  const viewLogin = (status) => {
    setIslogin(status);
    setError(null);
  };
  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{Islogin ? "Please Login!" : "Please sign up!"}</h2>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!Islogin && (
            <input
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, Islogin ? "login" : "signup")}
          />
        </form>
        {error && <p>{error}</p>}
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !Islogin
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: Islogin
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
