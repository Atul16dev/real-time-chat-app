import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = ({ selectedUser, setSelecterUser }) => {

    const scrollEnd = useRef()
    const { messages, getMessages, sendMessage } = useContext(ChatContext);
    const { authUser, onlineUser } = useContext(AuthContext);

    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setImage(base64Image);
        };
    }

    const handleSendMessage = () => {
        if (!text.trim() && !image) return;
        sendMessage({ text: text.trim(), image });
        setText('');
        setImage(null);
    }

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg flex flex-col'>
            {/* ----------Header--------- */}
            <div className='flex items-center gap-3 py-3
        mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt=""
                    className='w-8 aspect-[1/1] object-cover rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    <span className={`w-2 h-2 rounded-full ${onlineUser.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                </p>
                <img onClick={() => setSelecterUser(null)} src={assets.arrow_icon} alt="" className='md:hidden
            max-w-7'/>
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-8' />
            </div>
            {/* ---------Chat area---------- */}
            <div className='flex-1
             overflow-y-scroll p-3 pb-24'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end
                gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`} >
                        {msg.image ? (
                            <img src={msg.image} alt="" className='max-w-[230px] border
                        border-gray-700 rounded-lg overflow-hidden mb-8' />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg
                         mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>

                        )}
                        <div className='text-center text-xs'>
                            <img src={msg.senderId === authUser._id ? authUser.profilePic || assets.avatar_icon :
                                selectedUser.profilePic || assets.avatar_icon
                            } alt="" className='w-7 aspect-[1/1] object-cover rounded-full inline-block' />
                            <p className='text-gray-500 flex items-center justify-center gap-1 mt-1'>
                                {formatMessageTime(msg.createdAt)}
                                {msg.senderId === authUser._id && (
                                    <span className={`text-[10px] md:text-md font-bold leading-none ${msg.seen ? 'text-blue-500' : 'text-gray-400'}`}>
                                        {msg.seen ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </p>

                        </div>

                    </div>
                ))}
                <div ref={scrollEnd}>
                </div>

                {/* ------Bottom area----- */}
                <div className='absolute left-0 right-0 bottom-0 bg-[#282142]/80 flex items-center p-3 gap-3'>
                    <div className='flex-1 flex items-center bg-gray-100/10 px-3 py-1 rounded-full'>
                        <input type="text" placeholder='Send a message' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className='flex-1 text-sm p-2 border-none rounded-lg outline-none
                    text-white placeholder-gray-400 bg-transparent'/>

                        {image && (
                            <div className='relative w-10 h-10 mr-3 flex-shrink-0'>
                                <img src={image} className="w-full h-full rounded object-cover border border-gray-600" />
                                <button onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-white flex items-center justify-center text-[10px] cursor-pointer">x</button>
                            </div>
                        )}

                        <input type="file" id='image' accept='image/png, image/jpeg' onChange={handleImageChange} hidden />
                        <label htmlFor="image" className="flex items-center">
                            <img src={assets.gallery_icon} alt="" className='w-5 mr-1 cursor-pointer hover:opacity-80 transition-opacity' />
                        </label>
                    </div>
                    <img src={assets.send_button} alt="" onClick={handleSendMessage} className='w-7 cursor-pointer hover:scale-110 transition-transform' />
                </div>
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 
    bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer