<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Maya Chatbot</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <MessageDisplay v-for="message in messages" :key="message.id" :message="message" />
        <ion-item>
          <ion-input v-model="userMessage" placeholder="Type your query"></ion-input>
          <ion-button @click="sendMessage">Send</ion-button>
        </ion-item>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import MessageDisplay from './messagedisplay.vue';
  import { ref } from 'vue';
  
  export default {
    components: { MessageDisplay },
    setup() {
      const userMessage = ref('');
      const messages = ref([]);
  
      const sendMessage = () => {
        messages.value.push({ id: messages.value.length, role: 'user', content: userMessage.value });
        fetchResponse(userMessage.value);
        userMessage.value = '';
      };
  
      const fetchResponse = async (question) => {
        try {
          // Call your backend API to get the response and data
          const response = await fetch('/api/generate-response', {
            method: 'POST',
            body: JSON.stringify({ question }),
          });
          const data = await response.json();
  
          messages.value.push({
            id: messages.value.length,
            role: 'assistant',
            content: data.content,
            data: data.data,
          });
        } catch (error) {
          messages.value.push({
            id: messages.value.length,
            role: 'assistant',
            content: `Error: ${error.message}`,
          });
        }
      };
  
      return { userMessage, messages, sendMessage };
    },
  };
  </script>
  