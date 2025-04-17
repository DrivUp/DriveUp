import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import ChatBox from '../components/ChatBox'; // ✅ Import ChatBox

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('join', { userType: 'captain', userId: captain._id });

    socket.on('receive_message', (data) => {
      setChatMessages((prev) => [...prev, { from: data.fromId, text: data.message }]);
    });

    socket.on('ride-finished', () => {
      navigate('/captain-home');
    });

    return () => {
      socket.off('receive_message');
    };
  }, [captain]);

  const sendMessage = () => {
    if (!rideData || !rideData.user) return;

    const msg = {
      fromId: captain._id,
      fromType: 'captain',
      toId: rideData.user._id,
      toType: 'user',
      message: messageInput
    };

    socket.emit('send_message', msg);
    setChatMessages((prev) => [...prev, { from: captain._id, text: messageInput }]);
    setMessageInput('');
  };

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [finishRidePanel]);

  return (
    <div className='h-screen relative flex flex-col justify-end'>

      {/* Header */}
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Info Panel */}
      <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
        <h4 className='text-xl font-semibold'>{'4 KM away'}</h4>
        <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
      </div>

      {/* Finish Ride Panel */}
      <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <FinishRide
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel}
        />
      </div>

      {/* Map (placeholder for now) */}
      <div className='h-screen fixed w-screen top-0 z-[-1]'>
        {/* <LiveTracking /> */}
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className='fixed bottom-24 right-4 bg-black text-white px-4 py-2 rounded-full z-50'
      >
        Chat
      </button>

      {/* ChatBox */}
      {chatOpen && (
        <ChatBox
          chatMessages={chatMessages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
          setChatOpen={setChatOpen}
          user={captain}
        />
      )}
    </div>
  );
};

export default CaptainRiding;
