import React, { useState, useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import { Play, Send, Code2, Beaker, Terminal, ChevronRight, Lock , Eye, CheckCircle2} from "lucide-react";

 const languageMap = {
        'javascript':'javascript',
        'java':'java',
        'c++':'cpp'
    };





const Problempage = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [activeRightTab, setActiveRightTab] = useState('code');
    const editorRef = useRef(null);
    const [hasAttempted , sethasAttempted] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions , setLoadingSubmissions] = useState(false);
    const [hasFetchedSubmissions, setHasFetchedSubmissions] = useState(false);
    const [selectedSubmissionCode, setSelectedSubmissionCode] = useState(null);
    const [isCodeModalOpen, SetisCodeModalOpen] = useState(false);


    // 1. Fetch Initial Data and Code
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axiosClient.get(`/problem/problemById/${id}`);
                const fetchedProblem = response.data;
                setProblem(fetchedProblem);
        
                if(fetchedProblem?.startCode && Array.isArray(fetchedProblem.startCode)){
                const relevantCodeObj = fetchedProblem.startCode.find((item) => item.language.toLowerCase() === selectedLanguage.toLowerCase());
            if(relevantCodeObj){
                setCode(relevantCodeObj.boilerplateCode)
            } else {
                setCode("No Boilerplate avaliable for this language");
            }
            }
            } catch (err) {
                console.error("Error fetching problem:", err);
            }
        };
        fetchProblem();
    }, [selectedLanguage,id]);
  
   

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    // 6. Run Code logic
    const onRun = async () => {
        setIsLoading(true);
        sethasAttempted(true);
        setActiveRightTab('result'); 
        try {
            const response = await axiosClient.post(`/submission/run/${id}`, {
                code,
                language: selectedLanguage
            });
            setRunResult(response.data);
        } catch (err) {
            setRunResult({ error: err.response?.data?.message || "Execution Error" });
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Submit Code logic
    const onSubmit = async () => {
        setIsLoading(true);
        sethasAttempted(true);
        setActiveRightTab('result');
        try {
            const response = await axiosClient.post(`/submission/submit/${id}`, {
                code,
                language: selectedLanguage
            });
            setRunResult(response.data);
        } catch (err) {
            setRunResult({ error: err.response?.data?.message || "Submission Error" });
        } finally {
            setIsLoading(false);
        }
    };
    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-green-500 bg-green-500/10';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10';
            case 'hard': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-400 bg-gray-500/10';
        }
    };

const handleFetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
        const response = await axiosClient.get(`/problem/problemSolvedByUser/${id}`);
        if (Array.isArray(response.data)) {
            const currentproblemAttempts = response.data.filter(
                (sub) => sub.problemId === id
            )
            setSubmissions(currentproblemAttempts);
        }
         else {
            setSubmissions([]);
        }
        
        setHasFetchedSubmissions(true);
    } catch(err) {
        console.error("Error fetching solved problems:"+ err.message);
        setSubmissions([]); 
    } finally {
        setLoadingSubmissions(false);
    }
};
    return (
        <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
            {/* Header / Navbar Placeholder */}
            <div className="h-12 border-b border-gray-700 flex items-center px-4 justify-between bg-[#282828]">
                <div className="flex items-center gap-2 font-bold text-gray-300">
                    <Code2 size={20} className="text-yellow-500" />
                    <span>Problem</span>
                </div>
                <div className="flex gap-4">
                    <select 
                        className="bg-[#3e3e3e] border-none rounded px-2 py-1 text-sm outline-none"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        <option value="javascript">javascript</option>
                        <option value="c++">c++</option>
                        <option value="java">java</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* 2. LEFT PANEL: Description, Editorial, Submission, Solutions */}
                <div className="w-1/2 border-r border-gray-700 flex flex-col bg-[#282828]">
                    <div className="flex bg-[#333333] border-b border-gray-700">
                        {['description', 'editorial', 'submission', 'solutions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveLeftTab(tab)}
                                className={`px-4 py-2 text-sm capitalize ${activeLeftTab === tab ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        {activeLeftTab === 'description' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-4">{problem?.title || "Loading..."}</h1>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 whitespace-pre-wrap">Description :- {problem?.description || "Loading problem details..."}</p>
                                </div>
                                <div className="space-y-6">
            {problem?.visibleTestCases?.map((testCase, index) => (
                <div key={index} className="space-y-3">
                    <p className="text-sm font-medium mt-4 text-gray-400">Example {index + 1}:</p>
                    
                    <div className="space-y-4 ml-2 border-l-2 border-gray-700 pl-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Input</span>
                            <div className="mt-1 p-3 bg-[#333333] rounded-md font-mono text-sm text-blue-300">
                                {testCase.input}
                            </div>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Output</span>
                        <div className="mt-1  p-3 bg-[#333333] rounded-md font-mono text-sm text-green-300">
                            {testCase.output}
                        </div>
                        
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Explaination</span>
                        <div className="font-mono p-1 text-sm text-white-300">
                            {testCase.explaination}
                        </div>
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
                                </div>
                        )}
                        {activeLeftTab === 'editorial' && <div className="text-gray-400 italic">Editorial content is avaliable for only premium members</div>}
                        {/*Submission tab is here */}
                       {activeLeftTab === 'submission' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {!hasFetchedSubmissions ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-700 bg-[#333333]/20 rounded-lg">
                                        <Eye size={40} className="text-gray-500 mb-3" />
                                        <h3 className="text-base font-semibold text-gray-300">Track your progress</h3>
                                        <p className="text-xs text-gray-500 max-w-xs mb-4 mt-1">
                                            Click the button below to see all the standard problems you have solved successfully.
                                        </p>
                                        <button
                                            onClick={handleFetchSubmissions}
                                            disabled={loadingSubmissions}
                                            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 rounded transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {loadingSubmissions ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>
                                            ) : null}
                                            See your submissions
                                        </button>
                                    </div>
                                ) : submissions.length === 0 ? (
                                    <div className="text-gray-500 text-center py-10 italic text-sm">
                                        You haven't successfully solved any problems yet. Keep coding!
                                    </div>
                                ) : (
                                    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#1e1e1e]">
                                        <div className="bg-[#333333] px-4 py-3 border-b border-gray-700">
                                            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                                                <CheckCircle2 size={16} className="text-green-500" /> Solved Problem History
                                            </h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-700 text-xs font-bold text-gray-400 bg-[#252525]">
                                                        <th className="p-3">Status</th>
                                                        <th className="p-3">Language</th>
                                                        <th className="p-3 text-center">Runtime</th>
                                                        <th className="p-3 text-center">Memory</th>
                                                        <th className="p-3 text-center">Submitted At</th>
                                                        <th className="p-3 text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800 text-sm">
                                                   {submissions.map((sub, index) => (
                                                    <tr key={sub._id || index} className="hover:bg-[#333333]/40 border-b border-gray-800/50">
                                                        {/* 1. STATUS */}
                                                        <td className={`p-3 font-semibold ${sub.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                            {sub.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                                                            <span className="text-xs block text-gray-500 font-normal">
                                                                {sub.testCasesPassed || 0} / {sub.testCasesTotal || 0} passed
                                                            </span>
                                                        </td>

                                                        {/* 2. LANGUAGE */}
                                                        <td className="p-3 text-gray-300 font-mono text-xs">
                                                            <span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                                {sub.language}
                                                            </span>
                                                        </td>

                                                        {/* 3. RUNTIME */}
                                                        <td className="p-3 text-gray-300 font-mono text-xs">{sub.runtime} ms</td>

                                                        {/* 4. MEMORY */}
                                                        <td className="p-3 text-gray-300 font-mono text-xs">{(sub.memory / 1024).toFixed(1)} MB</td>

                                                        {/* 5. Submiited At */}
                                                        <td className="p-3 text-gray-400 text-xs">
                                                            {new Date(sub.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                                                        </td>

                                                        {/* 6. View Code Eye Button */}
                                                        <td className="p-3 text-center">
                                                            <button
                                                            type="button" onClick={() => {
                                                                setSelectedSubmissionCode(sub.code);
                                                                SetisCodeModalOpen(true);
                                                            }}
                                                            className="p-1 bg-grey-800 hover:bg-grey-700 border border-grey-700 text-grey-700 rounded transition-colors"
                                                            title="View Submitted Code"
                                                            ><Eye size={15} ></Eye></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
  
                        {activeLeftTab === 'solutions' && (
                            <div className="animate-in fade-in duration-300">
                                {!hasAttempted ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-700 rounded-lg bg-[#333333]/30">
                                        <Lock size={48} className="text-gray-600 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-300">Solutions are Locked</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                            Run or Submit your code at least once to reveal the reference implementation.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                                            <h2 className="text-xl font-bold">Reference Solution</h2>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                <span className="text-xs font-bold  text-yellow-500">{selectedLanguage}</span>
                                            </div>
                                        </div>

                                        {/* Mapping through solutions to find the exact one */}
                                        {problem?.referenceSolution
                                            ?.filter(sol => {
                                                const solLang = sol.language.toLowerCase();
                                                const currentLang = selectedLanguage.toLowerCase();
                                                return solLang === currentLang || solLang === languageMap[currentLang];
                                            })
                                            .map((sol, index) => (
                                                <div key={index} className="space-y-4">
                                                    <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
                                                        <div className="bg-[#333333] px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                                                            <Code2 size={14} className="text-blue-400" />
                                                            <span className="text-xs font-mono text-gray-400">Solution Implementation</span>
                                                        </div>
                                                        <div className="p-4 overflow-x-auto">
                                                            {/* Standard Text Display instead of Editor */}
                                                            <pre className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre">
                                                                {sol.completeCode}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-md">
                                                        <p className="text-xs text-blue-400/80 italic">
                                                            Note: This solution represents the optimal approach for {selectedLanguage}.
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        
                                        {/* Fallback if language isn't found in referenceSolution */}
                                        {(!problem?.referenceSolution?.some(sol => 
                                            sol.language.toLowerCase() === selectedLanguage.toLowerCase() || 
                                            sol.language.toLowerCase() === languageMap[selectedLanguage.toLowerCase()]
                                        )) && (
                                            <div className="text-gray-500 italic text-center py-10">
                                                No reference solution available for {selectedLanguage}.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                       
                    </div>
                </div>

                {/* RIGHT PANEL: Code, Testcase, Result */}
                <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                    {/* 3. Right Tabs */}
                    <div className="flex bg-[#333333] border-b border-gray-700">
                        {['code', 'testcase', 'result'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveRightTab(tab)}
                                className={`px-4 py-2 text-sm capitalize ${activeRightTab === tab ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {tab === 'code' ? <div className="flex items-center gap-1"><Code2 size={14}/>Code</div> : tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        {activeRightTab === 'code' && (
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={languageMap[selectedLanguage.toLowerCase()] || selectedLanguage}
                                value={code}
                                onMount={handleEditorMount}
                                onChange={handleEditorChange}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 10 }
                                }}
                            />
                        )}

                                {activeRightTab === 'testcase' && (
            <div className="p-4 overflow-y-auto h-full custom-scrollbar">
                {problem?.visibleTestCases?.length > 0 ? (
                    <div className="space-y-6">
                        {problem.visibleTestCases.map((testCase, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Case {index + 1}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400">Input</p>
                                    <pre className="bg-[#2d2d2d] p-3 rounded text-sm font-mono text-blue-300">
                                        {testCase.input}
                                    </pre>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400">Expected Output</p>
                                    <pre className="bg-[#2d2d2d] p-3 rounded text-sm font-mono text-green-300">
                                        {testCase.output}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 italic text-sm text-center mt-10">
                        No visible test cases available for this problem.
                    </div>
                )}
            </div>
        )}

                        {activeRightTab === 'result' && (
                            <div className="p-4 font-mono">
                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-yellow-500"></div>
                                        Executing code...
                                    </div>
                                ) : runResult ? (
                                    <div className={`p-4 rounded ${(runResult.status == "failed") ? 'bg-red-900/20 border border-red-500/50' : 'bg-green-900/20 border border-green-500/50'}`}>
                                        <h3 className={`font-bold mb-2 ${(runResult.status == "failed") ? 'text-red-400' : 'text-green-400'}`}>
                                            {runResult.status || (runResult.error ? "Error" : "Success")}
                                        </h3>
                                        <pre className="text-sm whitespace-pre-wrap">TotalRuntime: {runResult.totalRuntime || runResult.error || "No output returned"}ms</pre>
                                        {runResult.totalTestCases && <div className="mt-2 text-sm text-white-500 ">TotalTestCases: {runResult.totalTestCases}</div>}
                                        {runResult.passedCount && <div className="mt-2 text-sm text-white-500 ">PassedCases: {runResult.passedCount}</div>}
                                        {runResult.maxMemory && <div className="mt-2 text-sm text-white-500 ">Memory Usage: {runResult.maxMemory}kb</div>}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic text-sm">Run your code to see the results here.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. Bottom Buttons */}
                    <div className="h-14 border-t border-gray-700 bg-[#282828] flex items-center justify-between px-4">
                        <button 
                            className="flex items-center gap-1 text-sm bg-[#3e3e3e] hover:bg-[#4e4e4e] transition-colors px-3 py-1.5 rounded text-gray-200"
                            onClick={() => setActiveRightTab('result')}
                        >
                            <Terminal size={14}/> Console
                        </button>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={onRun}
                                disabled={isLoading}
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#3e3e3e] hover:bg-[#4e4e4e] text-white rounded text-sm transition-colors disabled:opacity-50"
                            >
                                <Play size={14} fill="currentColor"/> Run
                            </button>
                            <button 
                                type="button"
                                onClick={onSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                <Send size={14}/> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                                  {/* --- SUBMITTED CODE PREVIEW MODAL --- */}
{isCodeModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-[#1e1e1e] w-full max-w-3xl rounded-xl border border-gray-800 shadow-2xl flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#252526] rounded-t-xl">
                <div className="flex items-center gap-2 text-gray-200 font-semibold">
                    <Code2 size={18} className="text-green-500" />
                    <span>Submitted Solution Code</span>
                </div>
                <button
                    onClick={() => {
                        SetisCodeModalOpen(false);
                        setSelectedSubmissionCode(null);
                    }}
                    className="text-gray-400 hover:text-white text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
                >
                    ✕ Close
                </button>
            </div>

            {/* Modal Body with Code block wrapper */}
            <div className="p-4 overflow-y-auto flex-1 bg-[#151515] font-mono text-sm text-gray-300 rounded-b-xl">
                {selectedSubmissionCode ? (
                    <pre className="p-4 bg-[#1e1e1e] rounded border border-gray-800 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                        <code>{selectedSubmissionCode}</code>
                    </pre>
                ) : (
                    <p className="text-gray-500 text-center italic py-4">No code snapshot available for this execution.</p>
                )}
            </div>
        </div>
    </div>
)}
        </div>

        
    );
};

export default Problempage;