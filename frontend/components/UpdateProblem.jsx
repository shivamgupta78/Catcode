import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../src/utils/axiosClient';
import { useNavigate, useParams } from 'react-router';

const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'string', 'linked list', 'tree', 'graph', 'dynamic programming', 'greedy', 'backtracking', 'Two pointers']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explaination: z.string().min(1, "Explanation is required")
        })
    ).min(1, "At least One Visible Test Case is required"),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required")
        })
    ).min(1, "At least one hidden test case is required"),
    startCode: z.array(
        z.object({
            language: z.enum(['c++', 'java', 'javascript']),
            boilerplateCode: z.string().min(1, "Initial Code is required")
        }),
    ).min(3, "All three languages required"),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['c++', 'java', 'javascript']),
            completeCode: z.string().min(1, "Complete code is required")
        })
    ).length(3, "All three languages are required")
});

const UpdateProblem = () => {
  const { problemId } = useParams(); 
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(''); 

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explaination: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'c++', boilerplateCode: '' },
        { language: 'java', boilerplateCode: '' },
        { language: 'javascript', boilerplateCode: '' }
      ],
      referenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
  const { fields: startCodeFields } = useFieldArray({ control, name: "startCode" });
  const { fields: refSolutionFields } = useFieldArray({ control, name: "referenceSolution" });

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`); 
        const problem = response.data;
        
        reset({
          title: problem.title || '',
          description: problem.description || '',
          difficulty: problem.difficulty || 'easy',
          tags: problem.tags || 'array',
          visibleTestCases: problem.visibleTestCases?.length ? problem.visibleTestCases : [{ input: '', output: '', explaination: '' }],
          hiddenTestCases: problem.hiddenTestCases?.length ? problem.hiddenTestCases : [{ input: '', output: '' }],
          startCode: problem.startCode?.length ? problem.startCode : [
            { language: 'c++', boilerplateCode: '' },
            { language: 'java', boilerplateCode: '' },
            { language: 'javascript', boilerplateCode: '' }
          ],
          referenceSolution: problem.referenceSolution?.length ? problem.referenceSolution : [
            { language: 'c++', completeCode: '' },
            { language: 'java', completeCode: '' },
            { language: 'javascript', completeCode: '' }
          ]
        });
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        alert('Failed to load problem data. Check console for details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId) {
      fetchProblemData();
    }
  }, [problemId, reset]);

  const onSubmit = async (data) => {
    try {
      setSuccessMessage(''); 
      const response = await axiosClient.put(`/problem/update/${problemId}`, data);
      console.log("Problem updated successfully:", response.data);
      setSuccessMessage('Problem updated successfully! Redirecting to homepage in 5 seconds...');
      
      setTimeout(() => {
        navigate('/'); 
      }, 5000);

    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update problem.';
      alert(`Error updating problem: ${errorMessage}`);
    }
  };

  // Explicitly catch validation errors to prevent the button from looking "dead"
  const onValidationFail = (validationErrors) => {
    console.error("Zod Validation Failed:", validationErrors);
    alert("Validation failed! You have empty required fields. Check the red text below the inputs.");
  };

  if (isLoading) {
    return <div className="text-center p-10 text-xl">Loading Problem Data...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Update Problem</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Added onValidationFail to the handleSubmit to expose hidden errors */}
      <form onSubmit={handleSubmit(onSubmit, onValidationFail)}>
        
        <div>
          <label>Title</label>
          <input className='border' {...register('title')} placeholder='Enter Title here...' style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
          {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea className='border min-h-[300px]' placeholder='Enter Description here...'{...register('description')} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
          {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <div>
            <label className='mr-2 '>Difficulty</label>
            <select className='border bg-white-200 text-blue-400' {...register('difficulty')}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label>Tags</label>
            <select className='border ml-2 text-blue-500' {...register('tags')}>
              <option value="array">Array</option>
              <option value="linked list">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dynamic programming">DP</option>
              <option value="string">string</option>
              <option value="Two pointers">Two pointers</option>
              <option value="greedy">Greedy</option>
              <option value="backtracking">Backtracking</option>
            </select>
            {errors.tags && <p style={{ color: 'red' }}>{errors.tags.message}</p>}
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md ">Visible Test Cases</h3>
          <button 
            type="button" 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => appendVisible({ input: '', output: '', explaination: '' })}
          >
            Add Visible Test Case
          </button>
        </div>

        {visibleFields.map((field, index) => (
          <div key={field.id} className="mb-3">
            <div className="border border-gray-300 p-4 rounded flex gap-2">
                <input className="border p-1 flex-1" placeholder="Input" {...register(`visibleTestCases.${index}.input`)} />
                <input className="border p-1 flex-1" placeholder="Output" {...register(`visibleTestCases.${index}.output`)} />
                <input className="border p-1 flex-1" placeholder="Explaination" {...register(`visibleTestCases.${index}.explaination`)} />
                <button type="button" className="text-red-500 font-medium" onClick={() => removeVisible(index)}>Remove</button>
            </div>
            {/* ADDED EXPLICIT NESTED ERROR DISPLAY */}
            <div className="flex gap-2">
                {errors?.visibleTestCases?.[index]?.input && <p style={{ color: 'red', fontSize: '12px' }}>{errors.visibleTestCases[index].input.message}</p>}
                {errors?.visibleTestCases?.[index]?.output && <p style={{ color: 'red', fontSize: '12px' }}>{errors.visibleTestCases[index].output.message}</p>}
                {errors?.visibleTestCases?.[index]?.explaination && <p style={{ color: 'red', fontSize: '12px' }}>{errors.visibleTestCases[index].explaination.message}</p>}
            </div>
          </div>
        ))}
       
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-md text-white-500">Hidden Test Cases</h3>
          <button 
            type="button" 
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            onClick={() => appendHidden({ input: '', output: '' })}
          >
             Add Hidden Test Case
          </button>
        </div>

        {hiddenFields.map((field, index) => (
          <div key={field.id} className="mb-3">
            <div className="flex gap-3 items-center border border-gray-200 p-3 rounded-lg shadow-sm">
                <input className="border border-gray-300 rounded px-2 py-1 flex-1" placeholder="Input" {...register(`hiddenTestCases.${index}.input`)} />
                <input className="border border-gray-300 rounded px-2 py-1 flex-1" placeholder="Output" {...register(`hiddenTestCases.${index}.output`)} />
                <button type="button" className="text-red-600 hover:text-red-800 text-sm font-semibold p-1" onClick={() => removeHidden(index)}>Remove</button>
            </div>
            {/* ADDED EXPLICIT NESTED ERROR DISPLAY */}
            <div className="flex gap-2">
                {errors?.hiddenTestCases?.[index]?.input && <p style={{ color: 'red', fontSize: '12px' }}>{errors.hiddenTestCases[index].input.message}</p>}
                {errors?.hiddenTestCases?.[index]?.output && <p style={{ color: 'red', fontSize: '12px' }}>{errors.hiddenTestCases[index].output.message}</p>}
            </div>
          </div>
        ))}

        <h3>Start Code (Initial Templates)</h3>
        {startCodeFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px'}}>
            <label>{field.language}</label>
            <textarea 
               placeholder={`Initial code for ${field.language}`} 
               {...register(`startCode.${index}.boilerplateCode`)} 
               style={{ display: 'block', width: '100%', height: '180px',border:"1px solid white" }}
            />
            {/* ADDED EXPLICIT NESTED ERROR DISPLAY */}
            {errors?.startCode?.[index]?.boilerplateCode && <p style={{ color: 'red' }}>{errors.startCode[index].boilerplateCode.message}</p>}
          </div>
        ))}

        <h3>Reference Solutions</h3>
        {refSolutionFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label>{field.language}</label>
            <textarea 
               placeholder={`Complete solution for ${field.language}`} 
               {...register(`referenceSolution.${index}.completeCode`)} 
               style={{ display: 'block', width: '100%', height: '180px', border:"1px solid white" }}
            />
             {/* ADDED EXPLICIT NESTED ERROR DISPLAY */}
            {errors?.referenceSolution?.[index]?.completeCode && <p style={{ color: 'red' }}>{errors.referenceSolution[index].completeCode.message}</p>}
          </div>
        ))}

        <hr />
        
        <button 
          type="submit" 
          disabled={isSubmitting || successMessage !== ''}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isSubmitting || successMessage ? 'gray' : 'blue', 
            color: 'white', 
            cursor: isSubmitting || successMessage ? 'not-allowed' : 'pointer', 
            marginTop: '15px' 
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Problem'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;