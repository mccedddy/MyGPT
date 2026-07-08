<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MyGPT</title>
    @vite(['resources/css/app.css', 'resources/css/mygpt.css', 'resources/js/app.js', 'resources/js/mygpt.js'])
</head>
<body class="bg-gray-900 text-white overflow-hidden">
    <div class="flex h-screen">

        <!-- Sidebar -->
        <div class="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">

            <!-- Logo -->
            <div class="p-4 border-b border-gray-800">
                <a href="/" class="flex items-center gap-3 text-sm font-semibold text-white transition">
                    <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-sm font-bold text-slate-950">M</span>
                    <span>MyGPT</span>
                </a>
            </div>

            <!-- New Chat -->
            <div class="p-4 border-b border-gray-800">
                <button class="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition" onclick="startNewChat()">
                    <span>+</span>
                    <span>New chat</span>
                </button>
            </div>

            <!-- Chat History -->
            <div class="flex-1 overflow-y-auto p-4">
                <div class="py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer text-sm text-gray-300 transition mb-2 truncate">Today</div>
                <div class="py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer text-sm text-gray-300 transition mb-2 truncate">Yesterday</div>
                <div class="py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer text-sm text-gray-300 transition mb-2 truncate">Last 7 days</div>
            </div>

            <!-- Start Server -->
            <div class="p-6">
                <div class="flex gap-3">
                    <button class="bg-blue-600 flex-1 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" onclick="sendMessage()">
                        Start Server
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Chat Area -->
        <div class="flex-1 flex flex-col max-w-5xl mx-auto w-full">
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4" id="messagesArea">
                <div class="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                    <h1 class="text-3xl font-bold mb-2">MyGPT</h1>
                    <p>Start a new conversation</p>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-6">
                <div class="flex gap-3 items-end">
                    <textarea 
                        class="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none border border-gray-700 resize-none max-h-48 overflow-y-auto"
                        id="messageInput" 
                        placeholder="Message MyGPT..."
                        onkeypress="handleKeyPress(event)"
                        oninput="autoResizeTextarea(event)"
                        rows="1"
                    ></textarea>
                    <button id="sendButton" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" onclick="sendMessage()">
                        Send
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
