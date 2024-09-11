<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <img src="@/assets/maya-logo.png" alt="Maya Logo" class="logo" @click="redirectToHome" />
          Maya
        </ion-title>
      </ion-toolbar>
    </ion-header>
 
    <ion-content>
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <ion-spinner name="bubbles" v-if="message.isLoading" class="message-spinner"></ion-spinner>
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
                    <ion-col :class="['value-col']" v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</ion-col>
                  </ion-row>
                </ion-grid>
              </ion-col>
            </ion-row>
          </ion-grid>
        </template>
        <template v-if="checkData(message)">
          <p>Chart</p>
        </template>
        <template v-if="message.content">
          <p>{{ message.content }}</p>
        </template>
      </div>
    </ion-content>
   
    <ion-footer>
      <ion-toolbar>
        <ion-item lines="none">
          <ion-input v-model="message" placeholder="Type your query" @keyup.enter="sendMessage" clear-input></ion-input>
          <ion-icon :src="sendOutline" class="send-icon" @click="sendMessage"></ion-icon>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
 
<script>
import { CapacitorHttp } from '@capacitor/core';
import {
  IonIcon, IonFooter, IonInput, IonPage, IonTitle, IonItem, IonGrid,
  IonContent, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSpinner
} from '@ionic/vue';
import { sendOutline } from 'ionicons/icons';
 
export default {
  components: {
    IonFooter, IonInput, IonPage, IonTitle, IonIcon, IonItem, IonGrid,
    IonContent, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSpinner,
  },
  setup() {
    return {
      sendOutline
    }
  },
  data() {
    return {
      messages: [],
      message: '',
    };
  },
  methods: {
    sendMessage() {
      const question = this.message.trim();
      console.log('User Message:', question);
 
      if (!question) {
        this.messages.push({ role: 'assistant', content: 'Question is empty.' });
        return;
      }
 
      // Push user message
      this.messages.push({ role: 'user', content: question });
      this.message = '';
 
      // Add a loading message
      const loadingMessage = { role: 'assistant', content: '', isLoading: true };
      this.messages.push(loadingMessage);
 
      const filename = sessionStorage.getItem('filename');
 
      CapacitorHttp.post({
        url: 'http://127.0.0.1:5000/api/generate-response',
        headers: { 'Content-Type': 'application/json' },
        data: { question, filename },
      })
        .then((res) => {
          const data = res.data;
          console.log('Response:', data);
 
          // Remove the loading message
          loadingMessage.isLoading = false;
 
          // Push the actual response
          if (data.greet) {
            this.messages.push({ role: 'assistant', content: data.greet });
          } else if (data.columns && data.data) {
            const columns = data.columns.map((column) => ({ prop: column, name: column }));
            const rows = data.data;
            this.messages.push({
              role: 'assistant',
              content: '',
              tableData: { columns, rows },
            });
          } else {
            this.messages.push({ role: 'assistant', content: "Sorry, I couldn't understand the query. Please try again." });
          }
        })
        .catch((oErr) => {
          console.log('Error sending request:', oErr);
          loadingMessage.isLoading = false;
          this.messages.push({ role: 'assistant', content: `Error: ${oErr.message}` });
        });
    },
    checkData(message) {
      // Check if the message has valid table data and that the second column contains numbers
      if (message.tableData && message.tableData.columns.length === 2) {
        const secondColumnData = message.tableData.rows.map(row => row[1]);
        return secondColumnData.every(value => typeof value === 'number');
      }
      return false;
    },
    redirectToHome() {
      window.location.href = 'http://localhost:8100/Main/MAYA';
    },
    getChartOptions(tableData) {
      // Populate chart options with dynamic data
      console.log('Chart Options:', {
        chart: { type: 'column' },
        title: { text: 'Data Visualization' },
        xAxis: { categories: tableData.rows.map(row => row[0]) },
        series: [{
          name: tableData.columns[1].name,
          data: tableData.rows.map(row => row[1])
        }]
      });
      return {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Data Visualization'
        },
        xAxis: {
          categories: tableData.rows.map(row => row[0])
        },
        series: [{
          name: tableData.columns[1].name,
          data: tableData.rows.map(row => row[1])
        }]
      };
    }
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
  max-width: 100px;
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
 
/* User message styles */
.user {
  background-color: #0b93f6;
  color: white;
  float: right;
  text-align: left;
}
 
/* Assistant message styles */
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
 
/* Logo styles */
.logo {
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
}
 
/* Table styles */
.response-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
 
.response-table th,
.response-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
 
.response-table th {
  background-color: #f8f8f8;
}
 
.send-icon {
  font-size: 24px;
  cursor: pointer;
  color: #3880ff;
}
 
.data-grid {
  margin-top: 10px;
  width: 100%;
}
</style>
 
has context menu