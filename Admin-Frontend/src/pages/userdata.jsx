import { useState, useEffect } from 'react';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import './css/data.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


const Userdata = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const {data}= await axios.get("http://localhost:5200/api/users/users");
      setUsers(data);
      // console.log(data)
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  
  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:5200/api/users/del/${id}`,{});
      toast.success("Data Deleted Successfully")
      getUsers();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  }
  
  return (
    <>
      <div className="con-d">
        <h1 className="data">Users & Client List</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Users Name</th>
                <th scope="col">Users Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.userType}</td>
                  <td>
                    <button onClick={()=>handleDelete(user._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <ToastContainer/>

    </>
  );
};

export default Userdata;
