import React from 'react'
import categories from '../data/categories.json'
import { useNavigate } from 'react-router-dom';


function Categories() {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col sm:flex-row  gap-4 justify-center items-center'>
        {
            categories.categories.map((category)=>(
                <div key={category.id} onClick={()=> navigate(`/category/${category.name}`)} className='bg-[#dfc9f4] p-4 px-6 rounded-md max-w-[200px] hover:scale-[1.05] hover:shadow-primary shadow-lg translate-transform duration-200 cursor-pointer'>
                    <img src={category.icon.url} alt={category.name} width={80}  />
                    <p className='text-center w-full'>{category.name}</p>
                </div>
            ))
        }
    </div>
  )
}

export default Categories