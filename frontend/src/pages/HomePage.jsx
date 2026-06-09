import { useEffect, useState } from "react";
import {NavLink} from 'react-router'
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage(){
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.auth);
    const [problems,setproblems] = useState([]);
    const [solvedProblems,setsolvedProblems] = useState([]);
    const [filters,setFilters] = useState({
        difficulty:'all',
        tags:'all',
        status:'all'
    });

    useEffect(()=>{
        const fetchProblems = async ()=>{
            try{
                const {data} = await axiosClient.get('/problem/getAllProblem');
                setproblems(data);
            }catch(error){
                console.error("Error fetching problems",error);
            }
        };
        fetchProblems();
    }, [user]);
    const handleLogout = ()=>{
        dispatch(logoutUser());
        setsolvedProblems([]);
    }
    const filterdProblems = problems.filter(problem =>{
        const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
        const tagMatch = filters.tags === 'all' || problem.tags === filters.tags;
        return (difficultyMatch && tagMatch);

    })
    return (
        <div className="min-h-screen bg-base-200">
            <nav className="navbar bg-base-100 shadow-lg px-4">
                <div className="flex-1">
                    <NavLink to='/' className="btn btn-ghost text-xl">Catcode</NavLink>
                </div>
                
                <div className="flex-none rounded-md gap-4">
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost">{user?.firstName} </div>
                    <ul className="mt-3 p-2 rounded-md shadow menu menu-sm dropdown-content bg-base-100  w-30">
                        <li><button onClick={handleLogout} className="active:bg-blue-500">Logout</button></li>
                        {user && user.role ==='admin'&&(<NavLink to="/admin" className="btn btn-secondary mt-1 p-2">Admin</NavLink>)}
                  </ul>
                    </div>
                </div>
            </nav>
            {/* //main content  */}
            <div className="container mx-auto p-4">
                <div className="flex flex-wrap gap-4 mb-6">
                    <select className="select select-bordered"
                    value={filters.status}
                    >
                        <option value="all">All Problems</option>
                    </select>
                    <select className="select select-bordered"
                    value={filters.difficulty}
                    onChange={(e)=>setFilters({...filters,difficulty:e.target.value})}>
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <select className="select select-bordered"
                    value={filters.tags}
                    onChange={(e)=>setFilters({...filters,tags:e.target.value})}>
                        <option value="all">All Tags</option>
                        <option value="array">Array</option>
                        <option value="linked list">Linked List</option>
                        <option value="dynamic programming">DP</option>
                        <option value="string">Strings</option>
                        <option value="greedy">Greedy</option>
                        <option value="backtracking">Backtracking</option>
                    </select>
                </div>
                {/* //problem List  */}
                <div className="grid gap-4">
                    {filterdProblems.map((problem, index) =>(
                        <div key={problem._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-center justify-between">
                                    <h2 className="card-title">
                                        <NavLink to={`problem/${problem._id}`} className="hover:text-primary"><span className="opacity-80 mr-2">{index + 1}.</span>{problem.title}</NavLink>
                                   </h2>
                                    {solvedProblems.some(sp => sp._id === problem._id) && (
                                        <div className="badge badge-success gap-2"></div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </div>
                                    <div className="badge badge-info">{problem.tags}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
const getDifficultyBadgeColor = (difficulty) =>{
    switch (difficulty.toLowerCase()){
        case 'easy':return 'badge-success';
        case 'medium': return 'badge-warning';
        case 'hard': return 'badge-error';
        default:return 'badge-neutral';
    }
};

export default Homepage;