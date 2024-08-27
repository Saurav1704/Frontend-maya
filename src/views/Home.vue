<template>
  <ion-page>
    <ion-header :translucent = "true">
      <ion-toolbar>
        <ion-title>Maya Chatbot</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-for="(message, index) in messages" :key="index" :class="message.role">
        <p>{{ message.content }}</p>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input v-model="userMessage" placeholder="Type your query" @keyup.enter="sendMessage"></ion-input>
          <ion-button @click="sendMessage" >Send</ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const userMessage = ref('');
    const messages = ref([]);

    const sendMessage = async () => {
      const question = userMessage.value;
      messages.value.push({ role: 'user', content: question });

      try {
        const response = await fetch('http://localhost:5000/api/generate-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question }),
        });

        const data = await response.json();
        messages.value.push({ role: 'assistant', content: data.response });
      } catch (error) {
        messages.value.push({ role: 'assistant', content: `Error: ${error.message}` });
      }

      userMessage.value = '';
    };

    return { userMessage, messages, sendMessage };
  },
};
</script>

<style>
.user {
  text-align: right;
  margin: 10px;
}

.assistant {
  text-align: left;
  margin: 10px;
}

/* Make sure the content doesn't overlap with the footer */
ion-content {
  --padding-bottom: 70px;
}

/* Ensure the footer is always at the bottom */
ion-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
