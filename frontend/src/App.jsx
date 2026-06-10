import {Routes,Route,Navigate} from 'react-router';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage'
import {checkAuth} from './authSlice';
import {useDispatch,useSelector} from 'react-redux';
import { useEffect } from 'react';
import Admin from './pages/Admin.jsx'
import Problempage from './pages/problempage.jsx';
import AdminDelete from '../components/DelProblem.jsx'
import AdminUpdate from '../components/AdminUpdate.jsx';
import UpdateProblem from '../components/UpdateProblem.jsx';

function App() {

const {isAuthenticated,loading,user} = useSelector((state)=>state.auth);
const dispatch = useDispatch();

useEffect(()=>{
  dispatch(checkAuth());
},[dispatch]);

  if(loading){
    return <div className='min-h-screen flex items-center justify-center'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  }
  return (
    <>
     <Routes>
      <Route path="/" element={isAuthenticated?<HomePage></HomePage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to ="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin'? <Admin />:<Navigate to="/"/> } />
      <Route path="/admin/create" element={isAuthenticated && user.role==='admin'?<AdminPage />:<Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user.role==='admin'?<AdminUpdate />:<Navigate to="/" />} />
      <Route path="/admin/probupdate/:problemId" element={isAuthenticated && user.role==='admin'?<UpdateProblem />:<Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user.role==='admin'?<AdminDelete />:<Navigate to="/" />} />
      <Route path="/problem/:id" element={<Problempage />} /> 

     </Routes>

    </>
  )
}

export default App
