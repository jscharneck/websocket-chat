const socket = io();

const form = document.querySelector("form");
const input = document.querySelector("#input");
const messages = document.getElementById("messages");
const files = document.getElementById("file");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value) {
    socket.emit("message", input.value);
    //input.value = "";
  }

  upload(files.files);
});

socket.on("message", (msg) => {
  console.log("msg: ", msg);
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

function upload(files) {
  // debugger;
  console.log("files: ", files);
  console.log("files[0]: ", files[0]);

  socket.emit("upload", files, (status) => {
    console.log("status: ", status);
  });
}
