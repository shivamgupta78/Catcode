import React, {useState} from 'react';
import {Plus,Edit,Trash2,Home,RefreshCw,Zap,Video} from 'lucide-react'
import { NavLink } from 'react-router';

function Admin(){
    const [selectedOption,setSelectedOption] = useState(null);
    const adminoptions = [{
        id:'create',
        title:'create problem',
        description:'Add a new coding problem to the platform',
        icon:Plus,
        color:'btn-success',
        bgcolor:'bg-success/10',
        route:'/admin/create'
    },
{
    id:'update',
    title:"Update Problem",
    description:'Edit existing problems and their details',
    icon:Edit,
    color:'btn-warning',
    bgcolor:'bg-warning/10',
    route:'/admin/update'
},{
    id:'delete',
    title:'Delete Problem',
    description:'Remove Problems from the platform',
    icon:Trash2,
    color:'btn-error',
    bgcolor:'bg-error/10',
    route:'/admin/delete'
},
,{
    id:'video',
    title:'Video Upload',
    description:"Upload and Delete videos",
    icon:Video,
    color:'btn-success',
    bgcolor:'bg-success/10',
    route:'/admin/video'
}]
    return (
        <div className="min-h-screen bg-base-200">
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold text-base-content mb-4'>Admin panel</h1>
                    <p className='text-base-content/70 text-lg'>Manage Coding Problems on your platform</p>
                </div>
                <div className='grid grid-cols-1 md:grid-col-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                    {adminoptions.map((options)=>{
                        const IconComponent = options.icon;
                        return (
                            <div key={options.id} className='card bg-base-100 shadow-xl hover-shadow-2xl transition-all duration-300'>
                                <div className='card-body items-center text-center p-8'>
                                    <div className={`${options.bgcolor}p-4 rounded-full mb-4`}>
                                    <IconComponent size={32} className='text-base-content' />
                                    </div>
                                <h2 className='card-title text-xl mb-2'>{options.title}</h2>

                                <p className='text-base-content/70 mb-6'>{options.description}</p>
                                <div className='card-actions'>
                                    <div className='card-actions'>
                                        <NavLink to={options.route} className={`btn ${options.color} btn-wide`}>{options.title}</NavLink>
                                    </div>
                                </div>
                                </div>
                                </div>
                        )    
                    })}
                </div>
            </div>
        </div>
    )


}


export default Admin