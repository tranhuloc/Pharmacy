<script setup lang="ts">
/**
 * Dependencies injection library
 */
import axios from 'axios';
import { ref } from "vue";

/**
 * Variable define
 */
defineProps({
  socials: {
    type: Array,
    icon: String,
    link: String,
    default: () => [
      {
        icon: '<i class="fab fa-facebook text-lg opacity-8"></i>',
        link: "https://www.facebook.com/CreativeTim/",
      },
      {
        icon: '<i class="fab fa-twitter text-lg opacity-8"></i>',
        link: "https://twitter.com/creativetim",
      },
      {
        icon: '<i class="fab fa-dribbble text-lg opacity-8"></i>',
        link: "https://dribbble.com/creativetim",
      },
      {
        icon: '<i class="fab fa-github text-lg opacity-8"></i>',
        link: "https://github.com/creativetimofficial",
      },
      {
        icon: '<i class="fab fa-youtube text-lg opacity-8"></i>',
        link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
      },
    ],
  },
  links: {
    type: Array,
    name: String,
    href: String,
    default: () => [
      { href: "https://www.creative-tim.com/", name: "Company" },
      { href: "https://www.creative-tim.com/presentation", name: "About Us" },
      { href: "https://www.creative-tim.com/presentation", name: "Team" },
      {
        href: "https://www.creative-tim.com/templates/vuejs",
        name: "Products",
      },
      { href: "https://www.creative-tim.com/blog", name: "Blog" },
      { href: "https://www.creative-tim.com/license", name: "License" },
    ],
  },
});

const message = ref<any>('');
const isCollapsed = ref<any>(true);

/**
 * Life circle vue js
 */


/**
 * Function
 */
const toggleChatbot = () => {
  isCollapsed.value = !isCollapsed.value;
};

const send = async () => {
  if (message.value === "") return;
  addMsg(message.value);
  try {
    const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      sender: '',
      message: message.value
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'charset': 'UTF-8',
      },
      credentials: "same-origin"
    });

    if (response.data) {
      const temp = response.data[0];
      const recipient_id = temp.recipient_id;
      const recipient_msg = temp.text;

      const response_temp = { sender: "bot", recipient_id: recipient_id, msg: recipient_msg };

      addResponseMsg(response_temp.msg);
      // scrollBottom();
    }
  } catch (error) {
    console.error('Error:', error);
  }

  message.value = '';
};

const addMsg = (msg: any) => {
  let div = document.createElement("div");
  div.innerHTML = `<span style="flex-grow:1"></span><div class="chat-message-sent">${msg}</div>`;
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
};

const addResponseMsg = (msg: any) => {
  let div = document.createElement("div");
  div.innerHTML = `<div class="chat-message-received">${msg}</div>`;
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById("message-box").scrollHeight;
}

</script>
<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mb-4 mx-auto text-center">
          <a v-for="{ name, href } of links" :key="name" :href="href" target="_blank"
            class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2">
            {{ name }}
          </a>
        </div>
        <div class="col-lg-8 mx-auto text-center mb-4 mt-2">
          <a v-for="{ icon, link } of socials" :key="link" :href="link" target="_blank"
            class="text-secondary me-xl-4 me-4" v-html="icon">
          </a>
        </div>
      </div>
      <div class="row">
        <div class="col-8 mx-auto text-center mt-1">
          <p class="mb-0 text-secondary">
            Copyright © {{ new Date().getFullYear() }} Material by Creative Tim.
          </p>
        </div>
      </div>
    </div>
  </footer>
  <div :class="{ 'main-card': true, collapsed: isCollapsed }" id="chatbot">
    <button id="chatbot_toggle" @click="toggleChatbot">
      <svg v-if="isCollapsed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    </button>
    <div class="main-title">
      <div>
        <svg viewBox="0 0 640 512" title="robot">
          <path fill="currentColor"
            d="M32,224H64V416H32A31.96166,31.96166,0,0,1,0,384V256A31.96166,31.96166,0,0,1,32,224Zm512-48V448a64.06328,64.06328,0,0,1-64,64H160a64.06328,64.06328,0,0,1-64-64V176a79.974,79.974,0,0,1,80-80H288V32a32,32,0,0,1,64,0V96H464A79.974,79.974,0,0,1,544,176ZM264,256a40,40,0,1,0-40,40A39.997,39.997,0,0,0,264,256Zm-8,128H192v32h64Zm96,0H288v32h64ZM456,256a40,40,0,1,0-40,40A39.997,39.997,0,0,0,456,256Zm-8,128H384v32h64ZM640,256V384a31.96166,31.96166,0,0,1-32,32H576V224h32A31.96166,31.96166,0,0,1,640,256Z" />
        </svg>
      </div>
      <span>Chatbot</span>
    </div>
    <div class="chat-area" id="message-box"></div>
    <div class="line"></div>
    <div class="input-div">
      <input class="input-message" v-model="message" @keyup.enter="send" type="text"
        placeholder="Nhập tin nhắn của bạn ..." />
      <button class="input-send" @click="send">
        <svg style="width:24px;height:24px">
          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
#chatbot {
  position: fixed;
  z-index: 999;
}

.title {
  margin: auto;
  font-size: x-large;
  font-family: Raleway, sans-serif;
  color: rebeccapurple;
}

@media (min-width: 450px) {
  .main-card {
    width: 96%;
    max-width: 400px;
    height: calc(100% - 32px) !important;
    border-radius: 8px !important;
    max-height: 600px;
    margin: 16px !important;
  }
}

.collapsed {
  width: 48px !important;
  height: 48px !important;
  border-radius: 24px !important;
  margin: 16px !important;
}

.main-card {
  background: white;
  /* color: white; */
  width: 100%;
  height: 100%;
  margin: 0px;
  border-radius: 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  right: 0;
  bottom: 0;
  position: absolute;
  transition: all 0.5s;
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#chatbot_toggle {
  position: absolute;
  right: 0;
  border: none;
  height: 48px;
  width: 48px;
  background: rebeccapurple;
  padding: 14px;
  color: white;
}

#chatbot_toggle:hover {
  background: #7d56a5;
}

.line {
  height: 1px;
  background-color: rebeccapurple;
  width: 100%;
  opacity: 0.2;
}

.main-title {
  background-color: rebeccapurple;
  font-size: large;
  font-weight: bold;
  display: flex;
  height: 48px;
  color: white
}

.main-title>div {
  height: 48px;
  width: 48px;
  display: flex;
  margin-left: 8px;
}

.main-title svg {
  height: 24px;
  margin: auto;
}

.main-title>span {
  margin: auto auto auto 8px;
}

.chat-area {
  flex-grow: 1;
  overflow: auto;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.input-message {
  padding: 8px 48px 8px 16px;
  flex-grow: 1;
  border: none;
}

.input-message:focus {
  outline: none;
}

.input-div {
  height: 48px;
  display: flex;
}

.input-send {
  background: transparent;
  width: 48px;
  height: 48px;
  right: 0%;
  border: none;
  cursor: pointer;
}

.input-send:hover {
  background: lavender;
}

.input-send svg {
  fill: rebeccapurple;
  margin: 11px 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>