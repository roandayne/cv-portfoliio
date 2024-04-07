import { useState } from "react";
import Header from "./components/Header/Header";
import Landing from "./containers/Landing/Landing";
import Resume from "./containers/Resume/Resume";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Header>
      <Landing />
      <Resume />
    </Header>
  );
}

export default App;
