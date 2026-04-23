import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorize = () => {
  return (
    <section className='flex flex-col gap-8 bg-black w-full min-h-screen items-center justify-center text-red-600 text-xl font-bold'><span className='font-bold text-2xl'>Unauthorized Route Access</span>Access Denied <span className='text-lg font-medium'>You do not have permission to view this page. Please contact the administrator if you believe this is a mistake</span><Link to={"/dashboard  "} className='bg-red-500 text-white font-bold text-sm mt-4 px-4 py-2 cursor-pointer'>Return Back</Link> </section>
  )
}

export default Unauthorize