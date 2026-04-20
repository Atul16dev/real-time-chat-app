import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const RightSidebar = ({selectedUser}) => {
  const { onlineUser, logout } = useContext(AuthContext);
  const { messages } = useContext(ChatContext);

  const conversationImages = messages ? messages.filter(msg => msg.image).map(msg => msg.image) : [];

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full
    relative overflow-y-scroll 
    {selectedUser ? "max-md:hidden"}`} >

        <div className='pt-16 flex flex-col items-center gap-2
            text-xs font-light mx-auto'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
            className='w-20 aspect-[1/1] rounded-full' />
            <h1 className='px-10 text-xl front-medium
               mx-auto flex items-center gap-2'>
                <p className={`w-2 h-2 rounded-full ${onlineUser.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                {selectedUser.fullName}
            </h1>
            <p className='px-10 mx-auto'>{selectedUser.bio}</p>
        </div>
        <hr className='border-[#ffffff50] my-4'/>
        <div className='px-5 text-xs'>
            <p>Media</p>
            <div className='mt-2 max-h-[200px] overflow-y-scroll 
              grid grid-cols-2 gap-4 opacity-80'>
                {conversationImages.length > 0 ? (
                    conversationImages.map((url, index)=>(
                        <div key={index} onClick={()=> window.open(url)}
                        className='cursor-pointer rounded border border-gray-600 overflow-hidden'>
                            <img src={url} alt="" className='h-full w-full object-cover aspect-square hover:scale-105 transition-transform'/>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500 col-span-2 text-center py-4 rounded-lg'>No media shared</p>
                )}
            </div>

        </div>

        <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2
             bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
             text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-500/30'>
            Logout
        </button>
    </div>
  )
}

export default RightSidebar