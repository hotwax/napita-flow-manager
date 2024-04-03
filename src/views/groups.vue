<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-button slot="start" />
        <ion-title>Napita Flow Manager</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="group">
        <aside>
          <h1>{{ translate("Process Groups") }}</h1>
          <ion-list>
            <ion-item v-for="group in processGroups" :key="group?.id" button detail @click="onProcessGroupChange(group)">
              <ion-label :color="group.id === CurrentProcessGroup?.id ? 'primary' : ''">
                <!-- <p class="overline">{{ group.id }}</p> -->
                {{ group.name }}
              </ion-label>
            </ion-item>
          </ion-list>
        </aside>
        <main v-if="CurrentProcessGroup?.id">
          <div>
            <ion-item lines="none">
              <ion-label>
                <ion-note class="overline">{{ CurrentProcessGroup.id }}</ion-note>
                <h1>{{ CurrentProcessGroup.name }}</h1>
              </ion-label>
            </ion-item>
          </div>
          <hr />
          <div v-if="currentProcessBygroupDetail.length > 0">
            <ion-accordion-group>
              <ion-radio-group >
                <ion-accordion v-for="(process, index) in currentProcessBygroupDetail" :key="index" >
                  <ion-item slot="header">
                    <ion-label class="ion-text-wrap">
                      {{ process.name }}
                    </ion-label>
                  </ion-item>
                </ion-accordion>
              </ion-radio-group>
            </ion-accordion-group>
          </div>
          <div v-else class="empty-state" >
            <p>No process found for {{ CurrentProcessGroup.name }} .</p>
          </div>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter } from "@ionic/vue";
import { translate } from "../i18n"
import { useGroupStore } from '../store/groups';
import { computed, ref } from "vue";

const groupStore = useGroupStore();
const currentProcessBygroupDetail = computed(() => groupStore.getCurrentGroupProcesses)
const CurrentProcessGroup = computed(() => groupStore.getCurrentGroup);
const processGroups = computed(() =>groupStore.getProcessGroups);

async function fetchProcessByGroups(id: string) {
  await groupStore.fetchProcessByGroups(id);
}

async function onProcessGroupChange(group: any) {
  const selectedProcessGroupId = group.id
  const selectedProcessGroup = processGroups.value.find((group: any) => group.id === selectedProcessGroupId);
  groupStore.setCurrentProcessGroup(selectedProcessGroup);
  // Fetch and display process details for the selected group
  await fetchProcessByGroups(selectedProcessGroupId); 
}

onIonViewWillEnter(async () => {
  await groupStore.fetchProcessGroups();
});
</script>
