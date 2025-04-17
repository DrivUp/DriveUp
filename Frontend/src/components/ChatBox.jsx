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

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-white flex flex-col border shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black text-white">
                <h2 className="text-lg font-semibold">Chat with Captain</h2>
                <button onClick={() => setChatOpen(false)} className="text-xl">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            msg.from === user._id || msg.fromId === user._id
                                ? 'bg-green-100 self-end text-right'
                                : 'bg-gray-100 self-start text-left'
                        }`}
                    >
                        {msg.text || msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 border px-4 py-2 rounded-full outline-none"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-black text-white px-4 py-2 rounded-full"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
