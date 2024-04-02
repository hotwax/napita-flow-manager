<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-button slot="start" />
        <ion-title>{{ translate("Settings") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="user-profile">
        <ion-card>
          <ion-item lines="full">
            <ion-card-header class="ion-no-padding ion-padding-vertical"> 
              <ion-card-title>{{ username }}</ion-card-title>
            </ion-card-header>
          </ion-item>
          <ion-button color="danger" @click="logout()">{{ translate("Logout") }}</ion-button>
          <!-- Commenting this code as we currently do not have reset password functionality -->
          <!-- <ion-button fill="outline" color="medium">{{ "Reset password") }}</ion-button> -->
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { useRouter } from "vue-router";
import { translate } from "@/i18n"
import { useUserStore } from '@/store/user';

const router = useRouter()
const userStore = useUserStore();
const username = userStore.getUserName

function logout() {
  userStore.logout().then(() => {
    router.push("/login");
  })
}
</script>

<style scoped>
  ion-card > ion-button {
    margin: var(--spacer-xs);
  }
  .user-profile {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
</style>
