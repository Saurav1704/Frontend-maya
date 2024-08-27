<template>
    <div v-if="message.role === 'user'" class="user-message">
      <p>{{ message.content }}</p>
    </div>
    <div v-else class="assistant-message">
      <p>{{ message.content }}</p>
      <DataTable v-if="message.data" :data="message.data" />
      <GraphicalDisplay v-if="message.data" :data="message.data" />
    </div>
  </template>
  
  <script>
  import DataTable from './datatable.vue';
  import GraphicalDisplay from './graphicaldisplay.vue';
  
  export default {
    props: ['message'],
    components: { DataTable, GraphicalDisplay },
  };
  </script>
  