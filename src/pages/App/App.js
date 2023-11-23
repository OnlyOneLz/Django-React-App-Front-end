import AddPost from '../addPost/addPost';
import Feed from '../feed/feed';
import { Login } from '../../components/login/login';
import Profile from '../profile/profile';
import Settings from '../settings/settings';
import Messages from '../messages/messages';
import MessageChat from '../messages/message_chat/message_chat';
import { Routes, Route } from "react-router-dom";
import Home from "../../components/home/home";
import SignUp from '../../components/signup/signup';
import CreateProfile from '../../components/create_profile/create_profile';
import OtherProfile from '../otherProfile/otherProfile';
import { Logout } from '../../components/logout/logout';
import './App.css';


function App() {
<script src="https://kit.fontawesome.com/f18c4116b9.js" crossorigin="anonymous"></script>

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/:id' element={<OtherProfile />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/add_post' element={<AddPost />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/message_chat' element={<MessageChat />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/create_profile' element={<CreateProfile />} />
      </Routes>
    </div>
  );
}

export default App;
