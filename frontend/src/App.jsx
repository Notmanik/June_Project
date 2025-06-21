import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./Pages/Layout.jsx";
import Home from "./Pages/Home.jsx";
import SignUp from "./Pages/SignUp.jsx";
import LogIn from "./Pages/LogIn.jsx";
import CreatePost from "./Pages/CreatePost.jsx";
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}></Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/createpost" element={<CreatePost/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
