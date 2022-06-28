const socket = io("http://localhost:3000");

const username = document.getElementById("username").innerText.trim();

const sendMessage = async () => {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    if (!message) {
        return;
    }

    await fetch("/chat/saveChat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            message,
        }),
    });

    const date = new Date();

    const textElement = `
    <div class="bg-white w-inherit mx-4 h-inherit text-gray-900 rounded-lg px-3 py-2 right mt-2">
	<div class="flex items-center justify-between">	
		<p class="text-blue-500 italic font-bold message mr-2">
			${username}
		</p>
		<span class="text-gray-500 italic font-base text-right">
		${
            String(date.getDate()).padStart(2, "0") +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            date.getFullYear() +
            " " +
            String(date.getHours()).padStart(2, "0") +
            ":" +
            String(date.getMinutes()).padStart(2, "0")
        }
		</span>
	</div>
    <span class="message">
        ${message}
    </span>
    </div>
    `;
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML += textElement;

    messageInput.value = "";

    socket.emit("send", { username, message });

    messageContainer.scrollTop = messageContainer.scrollHeight;
};

/*  
	<%= String(messages[i].date.getDate()).padStart(2, '0' ) + '-' +
	String(messages[i].date.getMonth()+1).padStart(2, '0' ) + '-' +
	messages[i].date.getFullYear() + ' ' +
	String(messages[i].date.getHours()).padStart(2, '0' )
	+':'+String(messages[i].date.getMinutes()).padStart(2, '0' ) %> 
*/

const send = document
    .getElementById("send")
    .addEventListener("click", sendMessage);

socket.on("receive", (data) => {
    const date = new Date();

    const textElement = `
    <div class="bg-white w-inherit mx-4 h-inherit text-gray-900 rounded-lg px-3 py-2 left mt-2">
    <div class="flex items-center justify-between">
		<p class="text-blue-500 italic font-bold message mr-2">
			${data.username}
		</p>
		<span class="text-gray-500 italic font-base text-right">
		${
            String(date.getDate()).padStart(2, "0") +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            date.getFullYear() +
            " " +
            String(date.getHours()).padStart(2, "0") +
            ":" +
            String(date.getMinutes()).padStart(2, "0")
        }
		</span>
	</div>
    <span class="message">
        ${data.message}
    </span>
    </div>
    `;

    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML += textElement;
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

window.onload = function () {
    const messageContainer = document.getElementById("message-container");
    messageContainer.scrollTop = messageContainer.scrollHeight;
};
