<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <img src="@/assets/logo.svg" alt="Maya Logo" class="logo" />
          Maya
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <p>{{ message.content }}</p>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input
            v-model="message"
            placeholder="Type your query"
            @keyup.enter="sendMessage"
            clear-input
          ></ion-input>
                    <!-- Change button to an icon button -->
            <ion-button @click="sendMessage" fill="clear">
            <ion-icon slot="icon-only" name="send-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page> 
</template>

<script>
import { CapacitorHttp } from '@capacitor/core';
import { IonButton, IonFooter, IonInput, IonPage, IonTitle, IonImg, IonIcon } from '@ionic/vue';

export default {
  components: {
    IonButton, IonFooter, IonInput, IonPage, IonTitle, IonImg, IonIcon
  },
  data() {
    return {
       messages: [],
       message: '',
    };
  },
  methods: {
    async sendMessage() {
      const question = this.message.trim();
      if (!question) {
         this.messages.push({ role: 'assistant', content: 'Question is empty.' });
         return;
      }

      this.messages.push({ role: 'user', content: question });
      this.message = '';

      try {
        const response = await CapacitorHttp.post({
          url: 'http://localhost:5000/api/generate-response',
          headers: { 'Content-Type': 'application/json' },
          data: { question: question },
        });
        const data = response.data;
        this.messages.push({ role: 'assistant', content: data.response || 'No response received.' });
      } catch (error) {
        this.messages.push({ role: 'assistant', content: `Error: ${error.message}` });
      }
    },
  },
};
</script>

<style scoped>
.message {
  display: inline-block; /* Allows dynamic width based on content */
  max-width: 75%; /* Maximum width of the message bubble */
  padding: 8px 12px; /* Padding inside the message bubble */
  border-radius: 15px; /* Rounded corners for the message bubble */
  margin: 10px ; /* Spacing between messages */
  word-wrap: break-word; /* Ensures long words break inside the box */
  word-break: break-word; /* Ensures long words break and do not overflow */
  white-space: pre-wrap; /* Preserves spaces and line breaks */
  clear: both; /* Clears float to avoid overlapping */
}

/* User message styles */
.user {
  background-color: #0b93f6; /* Blue background for user messages */
  color: white; /* White text for user messages */
  float: right; /* Aligns the user message to the right */
  text-align: left; /* Align text to the left inside the bubble */
}

/* Assistant message styles */
.assistant {
  background-color: #e5e5ea; /* Light gray background for assistant messages */
  color: black; /* Black text for assistant messages */
  float: left; /* Aligns the assistant message to the left */
  text-align: left; /* Align text to the left inside the bubble */
}

ion-content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  --padding-bottom: 70px; /* Prevents content from overlapping with footer */
  overflow-y: auto; /* Enables scrolling for long content */
}

ion-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.logo {
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
}
ion-button {
  padding: 0; /* Removes extra padding */
  margin: 0 10px; /* Adds a little margin */
}

ion-icon {
  font-size: 24px; /* Adjust the size of the send icon */
  color: #0b93f6; /* WhatsApp-like blue color */
}

</style>
