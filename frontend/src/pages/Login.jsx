import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch,useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';

//schemavalidation for signup 

const signupSchema = z.object(
    {
        email:z.string().email(),
        password: z.string().min(8,"password should contains atleast 8 characters")
    }
)

function Login(){
      const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated,loading,error} = useSelector((state)=>state.auth);
    const { register,handleSubmit,formState:{errors},} = useForm({resolver:zodResolver(signupSchema)});
     useEffect(()=>{
            if(isAuthenticated){
                navigate('/');
            }
        },[isAuthenticated])
        const onSubmit = (data)=>{
            dispatch(loginUser(data));
        }
    return(
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='card w-96 bg-base-100 shadow-xl shadow-green-800'>
                <div className='card-body'>
                    <h2 className='card-title justify-center text-3xl '>Catcode</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='form-control'>
                            
                        </div>
                        <div className='form-control mt-4'>
                             <label className='label mb-1'>
                                <span className='label-text'>Email Id</span>
                            </label>
                            <input type="emailId"
                            placeholder='john@gmail.com'
                            className={`input input-bodered ${errors.email && 'input-error'}`} 
                            {...register('email')} />
                            {errors.email && (
                                <span className='text-error'>{errors.email.message}</span>
                            )}

                        </div>
                        <div className='form-control mt-4'>
                             <label className='label mb-1'>
                                <span className='label-text'>password</span>
                            </label>
                            <input type="password"
                            placeholder='********'
                            className={`input input-bodered ${errors.password && 'input-error'}`} 
                            {...register('password')} />
                            {errors.password && (
                                <span className='text-error'>{errors.password.message}</span>
                            )}

                        </div>
                        <div className='form-control mt-6 flex justify-center'>
                            <button type='submit' className='btn btn-primary'>
                                Login
                            </button>
                        </div>
                        <div className='mt-4 text-center'>
                            <p className='text-md text-grey-600'>
                                Don't have an Account
                                <NavLink to="/signup" className="btn btn-link btn-xs md:btn-md text-primary no-underline hover:underline">Signup</NavLink>
                            </p>
                        </div>
                         
                    </form>
                </div>
            </div>
        </div>
       
    )
}

export default Login
