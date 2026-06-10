import { useForm , useFieldArray} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
    title:z.string().min(1,"Title is required"),
    description:z.string().min(1,"description is required"),
    difficulty:z.enum(['easy','medium','hard']),
    tags:z.enum(['array','string','linked list','tree','graph','dynamic programming','greedy','backtracking','Two pointers']),
    visibleTestCases:z.array(
        z.object ({
            input:z.string().min(1,"Input is required"),
            output:z.string().min(1,"output is required"),
            explaination:z.string().min(1,"Explaination is required")
        })
    ).min(1,"atleast One Visible Test Cases is required"),
    hiddenTestCases:z.array(
        z.object({
            input:z.string().min(1,"input is required"),
            output:z.string().min(1,"output is required")
        })
    ).min(1,"atleast one hidden test case is required"),
    startCode:z.array(
        z.object({
            language:z.enum(['c++','java','javascript']),
            boilerplateCode:z.string().min(1,"Initial Code is required")
        }),
    ).min(3,"All three languages required"),
    referenceSolution:z.array(
        z.object({
            language:z.enum(['c++','java','javascript']),
            completeCode:z.string().min(1,"Complete code is required")
        })
    ).length(3,"all three languages are required")

});

const AdminPage = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
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

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      console.log(response.data);
      navigate('/'); 
    } catch (error) {
      alert('Failed to create problem. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Create New Problem</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Basic Info */}
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
              <option value="grpah">Graph</option>
              <option value="dynamic programming">DP</option>
              <option value="string">string</option>
              <option value="two pointer">Two pointers</option>
              <option value="greedy">Greedy</option>
              <option value="backtracking">Backtracking</option>
            </select>
          </div>
        </div>
    {/* Header aur Button ka container */}
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
  <div key={field.id} className="border border-gray-300 p-4 mb-3 rounded flex gap-2">
    <input className="border p-1 flex-1" placeholder="Input" {...register(`visibleTestCases.${index}.input`)} />
    <input className="border p-1 flex-1" placeholder="Output" {...register(`visibleTestCases.${index}.output`)} />
    <input className="border p-1 flex-1" placeholder="Explaination" {...register(`visibleTestCases.${index}.explaination`)} />
    <button 
      type="button" 
      className="text-red-500 font-medium" 
      onClick={() => removeVisible(index)}
    >
      Remove
    </button>
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
  <div key={field.id} className="flex gap-3 items-center border border-gray-200 p-3 mb-3 rounded-lg shadow-sm">
    <input 
      className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500" 
      placeholder="Input" 
      {...register(`hiddenTestCases.${index}.input`)} 
    />
    <input 
      className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500" 
      placeholder="Output" 
      {...register(`hiddenTestCases.${index}.output`)} 
    />
    <button 
      type="button" 
      className="text-red-600 hover:text-red-800 text-sm font-semibold p-1"
      onClick={() => removeHidden(index)}
    >
      Remove
    </button>
  </div>
))}

{/* Error Message */}
{errors.hiddenTestCases && (
  <p className="text-red-500 text-sm mt-1 italic">
    {errors.hiddenTestCases.message}
  </p>
)}
        <h3>Start Code (Initial Templates)</h3>
        {startCodeFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px'}}>
            <label>{field.language}</label>
            <textarea 
               placeholder={`Initial code for ${field.language}`} 
               {...register(`startCode.${index}.boilerplateCode`)} 
               style={{ display: 'block', width: '100%', height: '180px',border:"1px solid white" }}
            />
          </div>
        ))}
        {errors.startCode && <p style={{ color: 'red' }}>{errors.startCode.message}</p>}

        <h3>Reference Solutions</h3>
        {refSolutionFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label>{field.language}</label>
            <textarea 
               placeholder={`Complete solution for ${field.language}`} 
               {...register(`referenceSolution.${index}.completeCode`)} 
               style={{ display: 'block', width: '100%', height: '180px', border:"1px solid white" }}
            />
          </div>
        ))}
        {errors.referenceSolution && <p style={{ color: 'red' }}>{errors.referenceSolution.message}</p>}

        <hr />
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', cursor: 'pointer' }}>
          {isSubmitting ? 'Creating...' : 'Create Problem'}
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
