<template>
    <canvas ref="chart"></canvas>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    props: ['data'],
    setup(props) {
      const chart = ref(null);
  
      onMounted(() => {
        if (props.data && props.data.length === 2) {
          const ctx = chart.value.getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: props.data.map(row => row.label),
              datasets: [
                {
                  label: 'Data',
                  data: props.data.map(row => row.value),
                },
              ],
            },
          });
        }
      });
  
      return { chart };
    },
  };
  </script>
  