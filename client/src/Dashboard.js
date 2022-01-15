import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { getUser, removeUserSession } from './Utils/Common';

function Dashboard(props) {
  const user = getUser();
  const [data,setData]=useState({name:'',mobile:'',email:'',address:''});
  
  useEffect(() => {
    const data=axios.get('/getdata');
    console.log(data);
  }, []);

  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      alert("User Added Sucessfully!");
    
    axios.post('http://localhost:4000/add',data);
    props.history.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <><div>
      Welcome {user.name}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div><div>
        <form onSubmit={handleSubmit}> 
          <label>
            Name:
            <input type="text" name="name" onChange={(e)=>setData({...data,name:e.target.value})}/>
          </label>
          <label>
            Mobile:
            <input type="text" name="mobile"  onChange={(e)=>setData({...data,mobile:e.target.value})}/>
          </label>
          <label>
            Email:
            <input type="text" name="email"  onChange={(e)=>setData({...data,email:e.target.value})} />
          </label>
          <label>
            Address:
            <input type="text" name="address"  onChange={(e)=>setData({...data,address:e.target.value})} />
          </label>
          <input type="submit" value="Submit"  />
          </form>
      </div></>
  );
}

export default Dashboard;
