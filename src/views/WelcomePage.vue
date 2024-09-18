<template>
  <ion-page>

    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>

    <ion-content class="ion-padding">

      <div class="content-container">
        <div class="image-container">
          <img src="@/assets/welcome-icon.png" alt="Welcome Logo" class="centered-logo" />
        </div>
        <div class="welcome-message">
          <h2 class="animate-text">MAYA</h2>
          <p>MAYA AI is your ultimate generative AI chatbot, transforming business interactions into seamless,
            efficient, and engaging experiences that put control at your fingertips.</p>
        </div>
      </div>
    </ion-content>
    <!-- <ion-footer>
      <p class="menuHelp">* Please choose option from menu to begin *</p>
    </ion-footer> -->
  </ion-page>
</template>

<script>
import { IonButtons, IonContent, IonFooter, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
export default {
  name: 'WelcomePage',
  components: {
    IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonFooter
  },
  methods: {
    redirectToHome() {
      window.location.href = 'http://localhost:8100/Main/MAYA';
    },
  },
};
</script>

<style scoped>
ion-content {
  background: linear-gradient(45deg, #e0f7fa, #b3e5fc, #e0f7fa);
  background-size: 400% 400%;
  animation: gradientBackground 10s ease infinite;
  overflow: hidden;
  position: relative;
}

ion-content::part(scroll) {
    background-color: antiquewhite;
}

/* Floating Particles */
ion-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('path-to-particles.png');
  background-size: cover;
  opacity: 0.1;
  animation: floatParticles 20s linear infinite;
  z-index: 1;
  /* Behind content */
  pointer-events: none;
  /* Ensures no interaction */
}

/* Particles Animation */
@keyframes floatParticles {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0);
  }
}
ion-content .inner-scroll {
  background-color: #f5f5f5; /* Example: change background */
  padding: 20px; /* Example: add padding */
}

/* Content Container */
.content-container {
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  /* padding: 20px; */
  z-index: 10;
  /* Ensure content is above animations */
  position: relative;
  /* Ensures z-index works */
}

/* Image Container */
.image-container {
  position: relative;
  margin-bottom: 30px;
}

.centered-logo {
  width: 120px;
  height: 120px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.centered-logo:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Welcome Message Styles */
/* .welcome-message {
  animation: fadeIn 2s ease-in-out;
} */

.welcome-message h2 {
  margin-bottom: 20px;
  font-size: 3em;
  color: #6cbeea;
  text-shadow: 0 0 5px #3b6b86, 0 0 10px #48cae4, 0 0 20px #48cae4, 0 0 40px #48cae4;
  /* animation: neon 1.5s ease-in-out infinite alternate; */
}

/* Neon Animation */
@keyframes neon {
  0% {
    text-shadow: 0 0 5px #0077b6, 0 0 10px #429aab, 0 0 20px #429aab, 0 0 40px #429aab;
  }

  100% {
    text-shadow: 0 0 10px #0077b6, 0 0 20px #48cae4, 0 0 30px #48cae4, 0 0 50px #48cae4;
  }
}

/* Description Text */
.welcome-message p {
  font-size: 1.2em;
  color: #555;
  margin: 0 20px;
  animation: fadeIn 3s ease-in-out;
  line-height: 1.6;
}

/* Text Animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animated Text */
.animate-text {
  animation: textAnim 3s ease-in-out infinite alternate;
}

@keyframes textAnim {
  0% {
    color: #0077b6;
    text-shadow: 0 0 10px rgba(0, 119, 182, 0.6);
  }

  100% {
    color: #48cae4;
    text-shadow: 0 0 10px rgba(72, 202, 228, 0.6);
  }
}

/* Logo styles with hover effect */
.logo {
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.menuHelp {
  font-size: 16px;
  text-align: center;
  margin: 0;
  padding: 10px 0;
  color: #555;
}
</style>