import { useEffect,useState } from "react";
import axiosClient from '../src/utils/axiosClient'

const AdminDelete = () => {
    const [problems,setproblems]  = useState([]);
    const [loading,setloading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{
        fetchProblems()
    },[]);
    const fetchProblems = async () =>{
        try{
            setloading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setproblems(data);
        } catch(err){
            setError('Failed to fetch problems');
        } finally {
            setloading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this problem?"));
        try{
            await axiosClient.delete(`./problem/delete/${id}`);
            setproblems.problems.filter(problem => problem._id !== id);
        } catch(err){
            setError('failed to delete problem');
            console.error(err);
        }
    };
    if(loading){
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg">
                </span>
            </div>
        );

    }
    if(error){
        return (
            <div className="alert alert-error shadown-lg my-4">
                <div>
                    <svg xmlns="http://w3.org" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Delete Problems</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="w-1\12">#</th>
                            <th className="w-4\12">Title</th>
                            <th className="w-2\12">Difficulty</th>
                            <th className="w-3\12">Tags</th>
                            <th className="w-2\12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problems,index)=>(
                            <tr key={problems.id}>
                                <th>{index+1}</th>
                                <td>{problems.title}</td>
                                <td>
                                    <span className={`badge ${
                                        problems.difficulty === 'easy' ? 'badge-success' : problems.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>
                                            {problems.difficulty}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-outline">{problems.tags}</span>
                                </td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleDelete(problems._id)} className="btn btn-sm btn-error">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDelete