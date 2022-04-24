class ChatControls {
    constructor(socket, user = "admin") {
        this.messages = [];
        this.send = document.getElementById("btnSend");
        this.input = document.getElementById("inputChat");
        this.body = document.getElementById("chatbody");
        this.online = [];
        this.socket = socket;
        this.user = user;
    }
    emitChat(to = "all", sender = "admin", message) {
        this.socket.emit("chat_listener", { to, sender, message });
        this.render(to, sender, message);
        this.input.value = "";
        console.log(123);
    }
    render(to, sender, message) {
        message = this.escapeHTML(message);
        if (to == "all") {
            this.body.innerHTML += `
         <p>
            <b>${sender == "admin" ? "You" : sender}</b>: ${message}
         </p>
        `;
        } else {
            this.body.innerHTML += `
         <p style="color: #cc3300">
            <b><em>${sender == "admin" ? "You" : sender}</b> (messaged ${to == "admin" ? "You" : to}): ${message}
         </em></p>
        `;
        }
    }
    escapeHTML(message) {
        return message.replace(
            /[&<>'"]/g,
            (tag) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                }[tag] || tag)
        );
    }
}
