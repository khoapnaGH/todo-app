import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const App = () => {
  const [tasks, setTask] = useState(null);
  const [cookies, setcookie, removeCookie] = useCookies(null);
  const userEmail = cookies.email;
  const authToken = cookies.authToken;

  const getData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVERURL}/todos/${userEmail}`
      );
      const data = await response.json();
      setTask(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  // sort by date
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName="🏖️ Holiday Tick List!" getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>
          {sortedTasks &&
            sortedTasks.map((task) => (
              <ListItem key={task.id} task={task} getData={getData} />
            ))}
        </>
      )}
      <p className="copyright">Create Coding LLC</p>
    </div>
  );
};

export default App;
