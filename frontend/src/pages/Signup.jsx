import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch,useSelector } from 'react-redux';
import { registerUser } from '../authSlice';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

//schemavalidation for signup 

const signupSchema = z.object(
    {
        firstName:z.string().min(3,"Name should contain atleast 3 characters"),
        email:z.string().email(),
        password: z.string().min(8,"password should contains atleast 8 characters")
    }
)

function Signup(){
    const [showpassword,setshowpassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated,loading,error} = useSelector((state)=>state.auth);
    const { register,handleSubmit,formState:{errors},} = useForm({resolver:zodResolver(signupSchema)});
    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
        }
    },[isAuthenticated])
    const onSubmit = ((data)=>{
        dispatch(registerUser(data));
    })
    return(
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='card w-96 bg-base-100 shadow-xl shadow-green-700'>
                <div className='card-body'>
                    <h2 className='card-title justify-center text-3xl '>Leetcode</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='form-control'>
                            <label className='label mb-1'>
                                <span className='label-text'>First Name</span>
                            </label>
                            <input type="text"
                            placeholder='john'
                            className={`input input-bodered ${errors.firstName && 'input-error'}`} 
                            {...register('firstName')} />
                            {errors.firstName && (
                                <span className='text-error'>{errors.firstName.message}</span>
                            )}
                        </div>
                        <div className='form-control mt-4'>
                             <label className='label mb-1'>
                                <span className='label-text'>Email Id</span>
                            </label>
                            <input type="email"
                            placeholder='john@gmail.com'
                            className={`input input-bodered ${errors.email && 'input-error'}`} 
                            {...register('email')} />
                            {errors.email && (
                                <span className='text-error'>{errors.email.message}</span>
                            )}

                        </div>
                        <div className='form-control mt-4 relative'>
                             <label className='label mb-1'>
                                <span className='label-text'>password</span>
                            </label>
                            <input type={showpassword?'text':'password'}
                            placeholder='********'
                            className={`input input-bodered w-full pr-10 ${errors.password ?'input-error':''}`} 
                            {...register('password')} />
                            <button 
                            type='button'
                            className='absolute top-1/2 right-3 transform translate-y-1/2 text-grey-500 hover:text-grey-700'
                            onClick={()=>setshowpassword(!showpassword)}
                            arial-label={showpassword?"hide password":"show password"}>
                               {showpassword ? (<svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                height="15" 
                                width="15" 
                                style={{ cursor: 'pointer' }}
                                id="showIcon"
                                >
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path 
                                    fillRule="evenodd" 
                                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" 
                                    clipRule="evenodd" 
                                />
                                </svg> ):(
                                    <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    height="15" 
                                    width="15" 
                                    style={{ cursor: 'pointer' }} 
                                    id="hideIcon"
                                    >
                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                    </svg>
                                    
                                )}
                            </button>
                            {errors.password && (
                                <span className='text-error text-sm mt-1'>{errors.password.message}</span>
                            )}

                        </div>
                        <div className='form-control mt-8 flex justify-center'>
                            <button type='submit' className={`btn btn-primary ${loading?'loading':''}`}
                            disabled={loading}>
                                Sign up
                            </button>
                        </div>
                        <div className='mt-4 text-center'>
                            <p className='text-sm text-grey-600'>
                                Already have an account?
                                <NavLink to="/login" className="btn btn-link btn-xs md:btn-md text-primary lowercase no-underline hover:underline">Login </NavLink>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
       
    )
}

export default Signup
