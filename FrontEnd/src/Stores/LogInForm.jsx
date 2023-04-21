// import {react} from 'react'
// import InputField from "./InputField";
// import SubmitButton from "./SubmitButton";
import axios from 'axios';

import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import Validation from './LoginValidation';
const LogInFrom = () => {

       const [values, setValues] = useState({   
             email: '',
             password: ''   
             })    
        const navigate = useNavigate();
        const [errors, setErrors] = useState({})
        const [backendError, setBackendError] = useState([])
        const handleInput = (event) => {        
            setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
            }
            const handleSubmit =(event) => {        
                event.preventDefault();        
                const err = Validation(values); setErrors(err);        
                if(err.email === "" && err.password === "") {      
                      axios.post('http://localhost:8081/login', values).then(res => {    
                    if(res.data.errors) {
                        setBackendError(res.data.errors);
                    } 
                    else {
                    setBackendError([]);
                    if(res.data === "Success") {                        
                        navigate('/home');                    
                    } else {          
                      alert("No record existed");
                    }                }                           
                 }).catch(err => console.log(err));
                        }    }
      return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>        
           <div className='bg-white p-3 rounded w-25'>            
           <h2>Sing-In</h2>            
                {backendError ? backendError.map( e => (<p className='text-danger'>{e.msg}</p>)) : <span></span>}            
                    <form action="" onSubmit={handleSubmit}>                
                    <div className='mb-3'>                    
                    <label htmlFor="email"><strong>Email</strong></label>                    
                    <input type="email" placeholder='Enter Email' name='email'                    
                    onChange={handleInput} className='form-control rounded-0'/>                    
                    {errors.email && <span className='text-danger'> {errors.email}</span>}                
                </div>                
                <div className='mb-3'>                    
                <label htmlFor="password"><strong>Password</strong></label>                    
                <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-         0'/>                    
                {errors.password && <span className='text-danger'> {errors.password}</span>}                
                </div>                
                <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>                
                <p>You are agree to aour terms and policies</p>                
                <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>CreateAccount</Link>            
                </form>   
            </div>    
        </div>
      )
}
    



export default LogInFrom;