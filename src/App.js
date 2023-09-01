import "./App.css";
import Header from "./pages/header";
import Feed from "./pages/feed";
import Login from "./pages/auth/Login";
import { useStateValue } from "./context/StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <>
          <Header />
          <div className="app__body">
            <Feed />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
