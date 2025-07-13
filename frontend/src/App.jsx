import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./Pages/Layout.jsx";
import Home from "./Pages/Home.jsx";
import SignUp from "./Pages/SignUp.jsx";
import LogIn from "./Pages/LogIn.jsx";
import CreatePost from "./Pages/CreatePost.jsx";
import Profile from "./Pages/Profile.jsx";
import EditProfile from "./Pages/EditProfile.jsx";
import HelpPage from "./Pages/HelpPage.jsx";
import  Explore  from "./Pages/Explore.jsx";
import Temp from "./Pages/Temp.jsx"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Layout />}></Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/createpost" element={<CreatePost/>} />
        <Route path="/home/profile" element={<Profile />} />
        <Route path="/home/Explore" element={<Explore />} />
        <Route path="/home/profile/edit" element={<EditProfile />} />
        <Route path="/home/help" element={<HelpPage/>}></Route>
        <Route path="/" element={<Temp/>}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
