import { useState } from "react";
import Header from "./components/Header/Header";
import Landing from "./containers/Landing/Landing";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Header>
      <Landing />
    </Header>
  );
}

export default App;
