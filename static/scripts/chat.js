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

	const textElement = `
    <div class="bg-white w-inherit mx-4 h-inherit text-gray-900 rounded-lg px-3 py-2 right mt-2">
    <p class="text-blue-500 italic font-bold message mr-2">
        ${username}
    </p>
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

const send = document
	.getElementById("send")
	.addEventListener("click", sendMessage);

socket.on("receive", (data) => {
	const textElement = `
    <div class="bg-white w-inherit mx-4 h-inherit text-gray-900 rounded-lg px-3 py-2 left mt-2">
    <p class="text-blue-500 italic font-bold message mr-2">
        ${data.username}
    </p>
    <span class="message">
        ${data.message}
    </span>
    </div>
    `;

	const messageContainer = document.getElementById("message-container");
	messageContainer.innerHTML += textElement;
	messageContainer.scrollTop = messageContainer.scrollHeight;
});

window.onload = function() {
	const messageContainer = document.getElementById("message-container");
	messageContainer.scrollTop = messageContainer.scrollHeight;
};