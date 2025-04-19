import React, { useEffect, useRef } from 'react';

const ChatBox = ({
    chatMessages = [],
    messageInput,
    setMessageInput,
    sendMessage,
    setChatOpen,
    user
}) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 bg-opacity-30 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl h-[90vh] bg-gradient-to-br from-white to-gray-100 flex flex-col border shadow-xl rounded-lg overflow-hidden">
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-black to-gray-800 text-white shadow-md">
                    <h2 className="text-xl font-bold tracking-wide">What you want to chat ??</h2>
                    <button
                        onClick={() => setChatOpen(false)}
                        className="text-2xl hover:text-red-400 transition duration-200"
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>

                
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-white">
                    {chatMessages.map((msg, idx) => {
                        const isUser = msg.from === user._id || msg.fromId === user._id;
                        return (
                            <div
                                key={idx}
                                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                                    isUser
                                        ? 'ml-auto bg-black text-white rounded-br-none'
                                        : 'mr-auto bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                            >
                                {msg.text || msg.message}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white flex items-center gap-3 shadow-inner">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-black transition"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full transition font-medium shadow-sm"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
