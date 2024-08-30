<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <img src="@/assets/logo.svg" alt="Maya Logo" class="logo" />
          Maya</ion-title>
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
          <ion-input
            v-model="message"
            placeholder="Type your query"
            @keyup.enter="sendMessage"
            clear-input
          ></ion-input>
          <!-- <img src="@/assets/sopra-steria.png" alt="Maya Logo" class="bottom-logo" /> -->
          <ion-button @click="sendMessage">Send</ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { CapacitorHttp } from '@capacitor/core'; // Import CapacitorHttp
import { IonButton, IonFooter, IonInput, IonPage, IonTitle, IonImg } from '@ionic/vue';

export default {
  components: {
    IonButton, IonFooter, IonInput, IonPage, IonTitle, IonImg

  },
  data() {
    return {
       messages: [],
       message: '', // User input message
    };
  },
  methods: {
     async sendMessage() {
      const question = this.message.trim(); // Trim whitespace from input
      console.log('User Message:', question); // Debugging log to check the input value

      // // Check if the input is empty
       if (!question) {
         this.messages.push({ role: 'assistant', content: 'Question is empty.' });
         return;
       }

      // Add the user's message to the chat
      this.messages.push({ role: 'user', content: question });

     // Clear the input after sending the message
      this.message = '';

      try {
        // Send the input to the backend API
        const response = await CapacitorHttp.post({
          url: 'http://localhost:5000/api/generate-response', // Ensure this matches your backend URL
          headers: { 'Content-Type': 'application/json' },
          data: { question: question }, // Sending question as payload
        });

        // Check the response from the backend
        console.log('Response:', response); // Log the response to check its format
        const data = response.data;

        // Add the response from the backend to the chat
        this.messages.push({ role: 'assistant', content: data.response || 'No response received.' });
      } catch (error) {
        console.log('Error sending request:', error); // Log any errors encountered
        this.messages.push({ role: 'assistant', content: `Error: ${error.message}` });
      }


    },
  },
};
</script>

<style scoped>
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

/* Logo styles */
.logo {
  height: 30px; /* Adjust size as needed */
  margin-right: 8px; /* Space between logo and title */
  vertical-align: middle; /* Aligns logo vertically */
}

</style>

