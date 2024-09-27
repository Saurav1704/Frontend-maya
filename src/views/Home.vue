<template>
  <ion-page>
    <!-- <ion-header :translucent="true"> -->
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <!-- <ion-title> -->
      <!-- <img src="@/assets/maya-logo.png" alt="Maya Logo" class="logo" @click="redirectToHome" /> -->
      <!-- Maya -->
      <!-- </ion-title> -->
    </ion-toolbar>
    <!-- </ion-header> -->

    <ion-content>
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <!-- Spinner during loading -->
        <!-- <ion-spinner name="bubbles" v-if="message.isLoading" class="message-spinner"></ion-spinner> -->
        <ion-skeleton-text v-if="message.isLoading" animated style="width:15em;" />
        <ion-skeleton-text v-if="message.isLoading" animated style="width:10em;" />
        <ion-skeleton-text v-if="message.isLoading" animated style="width:5em;" />
        <!-- Table data -->
        <template v-if="message.tableData && message.tableData.rows.length">
          <ion-grid :class="['table-ct']">
            <ion-row :class="['header-table']">
              <ion-col :class="['header-col']" v-for="column in message.tableData.columns" :key="column.name">{{
                column.name }}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <ion-grid :class="['value-ct']">
                  <ion-row v-for="(row, rowIndex) in message.tableData.rows" :key="rowIndex">
                    <ion-col :class="['value-col']" v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell
                      }}</ion-col>
                  </ion-row>
                </ion-grid>
              </ion-col>
            </ion-row>
          </ion-grid>
        </template>

        <!-- Chart data (if applicable) -->
        <template v-if="checkData(message)">
          <BarChart :chartData="prepareChartData(message.tableData)" />
        </template>

        <!-- Text message -->
        <template v-if="message.content && !message.isLoading">
          <p>{{ message.content }}</p>
        </template>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input v-model="messageInput" :class="{ 'error': showError }" placeholder="Type your query"
            @keyup.enter="sendMessage" clear-input></ion-input>
          <ion-icon :src="sendOutline" class="send-icon" @click="sendMessage"></ion-icon>
          <ion-icon :src="micOutline" class="mic-icon" @click="startVoiceRecognition"
            :style="{ color: isListening ? 'red' : '#3880ff' }"></ion-icon>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { CapacitorHttp } from '@capacitor/core';
import {
  IonButton, IonIcon, IonFooter, IonInput, IonPage, IonTitle, IonImg, IonItem, IonGrid,
  IonContent, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSpinner,
  IonSkeletonText
} from '@ionic/vue';
import { sendOutline, micOutline } from 'ionicons/icons';
import BarChart from './BarChart.vue';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

export default {
  components: {
    IonButton, IonFooter, IonInput, IonPage, IonTitle, IonImg, IonIcon, IonItem, IonGrid,
    IonContent, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSpinner,
    BarChart, IonSkeletonText
  },
  setup() {
    return {
      sendOutline,
      micOutline
    }
  },
  data() {
    return {
      messages: [],
      messageInput: '',
      recognition: null,
      isListening: false,
      showToast: false,
      showError: false,
      title: sessionStorage.getItem('title'),
    };
  },
  mounted() {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      // Initialize Web Speech API for web
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        // Handle speech recognition result
        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Web Voice Input:', transcript);
          this.messageInput = transcript;
        };

        // Handle errors
        this.recognition.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
        };
      } else {
        console.log('Speech Recognition not supported in this browser.');
      }
    }
    this.welcomeMessage();
  },

  methods: {
    sendMessage() {
      const question = this.messageInput.trim();
      console.log('User Message:', question);

      if (!question) {
        // this.messages.push({ role: 'assistant', content: 'Question is empty.' });
        this.showToast = true;
        this.showError = true;

        setTimeout(() => {
          this.showError = false;
        }, 2000);
        return;
      }

      // Push the user's message and a loading spinner message
      this.messages.push({ role: 'user', content: question });
      const spinnerLoading = { role: 'assistant', content: '', isLoading: true };
      this.messages.push(spinnerLoading);

      this.messageInput = '';

      // Fetch filename from session storage
      const filename = sessionStorage.getItem('filename');

      // Make API call to backend
      CapacitorHttp.post({
        url: 'http://127.0.0.1:5000/api/generate-response',
        headers: { 'Content-Type': 'application/json' },
        data: { question, filename },
      }).then(res => {
        const data = res.data;
        console.log('Response:', data);

        // Replace spinner with actual response
        this.messages = this.messages.filter(msg => !msg.isLoading);

        if (data.greet) {
          this.messages.push({ role: 'assistant', content: data.greet });
        } else if (data.data.length === 0) {
          this.messages.push({ role: 'assistant', content: 'No data found.' });
        } else if (data.columns && data.data) {
          const columns = data.columns.map(column => ({ prop: column, name: column }));
          const rows = data.data;
          this.messages.push({
            role: 'assistant',
            content: '',
            tableData: { columns, rows }
          });
        } else {
          this.messages.push({ role: 'assistant', content: 'Sorry, I couldn\'t understand the query. Please try again.' });
        }
      }).catch(error => {
        console.log('Error sending request:', error);
        this.messages = this.messages.filter(msg => !msg.isLoading);
        this.messages.push({ role: 'assistant', content: `Error: ${error.message}` });
      });
    },

    welcomeMessage() {
      const title = this.title || 'MAYA'; // Default to 'MAYA' if title is not set
      const welcomeContent = `Welcome to ${title}. How can I assist you today?`;

      // Check if the last message is already a welcome message to avoid duplicates
      const lastMessage = this.messages[this.messages.length - 1];
      if (!lastMessage || lastMessage.content !== welcomeContent) {
        this.messages.push({ role: 'assistant', content: welcomeContent });
      }
    },

    async startVoiceRecognition() {
      const platform = Capacitor.getPlatform();

      if (platform === 'web' && this.recognition) {
        this.isListening = true;
        this.recognition.start();
        this.recognition.onend = () => {
          this.isListening = false;
        };
      } else if (platform === 'android' || platform === 'ios') {
        try {
          // Requesting permissions
          const hasPermission = await SpeechRecognition.checkPermissions();
          const hasPermissions = JSON.stringify(hasPermission);
          console.log('Permission status:', hasPermissions);
          if (hasPermission.speechRecognition != 'granted') {
            const permission = await SpeechRecognition.requestPermissions();
            console.log('Requested permissions:', JSON.stringify(permission));
            if (!permission.granted) {
              console.log('Speech recognition permission denied.');
              return;
            } else {
              console.log('Speech recognition permission granted.');
            }
          }

          console.log('Starting native Speech Recognition.');
          this.isListening = true;
          const result = await SpeechRecognition.start({
            language: 'en-US',
            matches: 1,
            prompt: 'Speak now',
            showPartial: true,
            popup: false,
            partialResults: true,
          });

          console.log('Native Voice Input:', result.matches[0]);
          this.messageInput = result.matches[0];
          this.isListening = false;

        } catch (error) {
          console.error('Speech recognition error:', error);
          this.isListening = false;
        }

        SpeechRecognition.addListener('partialResults', (data) => {
          console.log('Partial results:', data.matches);
        });
      } else {
        console.log('Platform not supported.');
      }
    },
    checkData(message) {
      if (message.tableData && message.tableData.columns.length === 2) {
        const secondColumnData = message.tableData.rows.map(row => row[1]);
        return secondColumnData.every(value => typeof value === 'number');
      }
      return false;
    },

    prepareChartData(tableData) {
      const labels = tableData.rows.map(row => row[0]);
      const data = tableData.rows.map(row => row[1]);

      return {
        labels,
        datasets: [{
          label: 'Data',
          backgroundColor: '#42A5F5',
          data
        }]
      };
    },

    redirectToHome() {
      window.location.href = 'http://localhost:8100/Main/MAYA';
    },
  }
};
</script>

<style scoped>
.table-ct {
  padding: 0px;
  margin: 0 -12px;
}

.header-table {
  background-color: #0b93f6;
  z-index: 1;
  position: sticky;
  top: 0px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.value-col {
  font-size: 14px;
  color: #000;
  text-align: center;
  align-self: center;
}

.value-ct {
  max-height: 150px;
  overflow-y: scroll;
  scrollbar-width: thin;
}

.header-col {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  align-self: center;
  white-space: normal;
  max-width: auto;
  word-break: break-word;
}

.message {
  display: inline-block;
  max-width: 75%;
  padding: 0px 12px;
  border-radius: 15px;
  margin: 10px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  clear: both;
}

.user {
  background-color: #0b93f6;
  color: white;
  float: right;
  text-align: left;
}

.assistant {
  background-color: #e5e5ea;
  color: black;
  float: left;
  text-align: left;
}

ion-content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  --padding-bottom: 70px;
  overflow-y: auto;
}

.message-spinner {
  display: block;
  margin: 20px auto;
  text-align: center;
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

.send-icon {
  font-size: 24px;
  cursor: pointer;
  color: #3880ff;
}

.mic-icon {
  font-size: 24px;
  cursor: pointer;
  color: #3880ff;
  margin-left: 10px;
}

.error {
  border: 1px solid red;
}

ion-input.error::part(native) {
  border-color: red;
}
</style>
