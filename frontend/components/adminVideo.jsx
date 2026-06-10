import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import axiosClient from '../src/utils/axiosClient';

const AdminVideo = () => {
    const [problems, setproblems] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setloading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setproblems(data);
        } catch (err) {
            setError('Failed to fetch problems');
        } finally {
            setloading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this problem?")) return;
        try {
            // FIXED: Path formatted from './problem/delete' to clean production '/problem/delete'
            await axiosClient.delete(`/problem/delete/${id}`);
            setproblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError('failed to delete problem');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 font-medium p-4 text-center">⚠️ Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-zinc-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">🎬 Media Infrastructure Management Control</h1>
            <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900 shadow-xl">
                <table className="table w-full text-zinc-300">
                    <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400">
                            <th>#</th>
                            <th>Problem Identity Header</th>
                            <th>Complexity Node</th>
                            <th>Indexed Tags</th>
                            <th>Pipeline Upload</th>
                            <th>Purge Check</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem, index) => (
                            <tr key={problem._id || index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                <th>{index + 1}</th>
                                <td className="font-medium text-white">{problem.title}</td>
                                <td>
                                    <span className={`badge ${
                                        problem.difficulty === 'easy' ? 'badge-success' : problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-outline text-zinc-400">{problem.tags}</span>
                                </td>
                                <td>
                                    {/* Mapped properly to video infrastructure component context router inside app */}
                                    <NavLink 
                                        to={`/admin/upload/${problem._id}`} 
                                        className='btn btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white font-semibold'
                                    >
                                        Upload Video
                                    </NavLink>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(problem._id)} 
                                        className="btn btn-sm btn-error bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminVideo;