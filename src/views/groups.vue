<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-button slot="start" />
        <ion-title>{{ translate("Napita Flow Manager") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="group">
        <aside>
          <h1>{{ translate("Process Groups") }}</h1>
          <ion-list>
            <ion-item v-for="group in processGroups" :key="group?.id" button detail @click="onProcessGroupChange(group)">
              <ion-label :color="group.id === currentProcessGroup?.id ? 'primary' : ''">
                <!-- <p class="overline">{{ group.id }}</p> -->
                {{ group.name }}
              </ion-label>
            </ion-item>
          </ion-list>
        </aside>
        <main v-if="currentProcessGroup?.id">
          <div>
            <ion-item lines="none">
              <ion-label>
                <ion-note class="overline">{{ currentProcessGroup.id }}</ion-note>
                <h1>{{ currentProcessGroup.name }}</h1>
              </ion-label>
            </ion-item>
          </div>
          <hr />
          <div v-if="currentGroupProcesses.length">
            <ion-accordion-group>
                <ion-accordion v-for="(process, index) in currentGroupProcesses" :key="index" >
                  <ion-item slot="header">
                    <ion-label class="ion-text-wrap">
                      {{ process.name }}
                    </ion-label>
                  </ion-item>
                </ion-accordion>
            </ion-accordion-group>
          </div>
          <div v-else class="empty-state" >
            <p>No process found for {{ currentProcessGroup.name }} .</p>
          </div>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonAccordion, IonAccordionGroup, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonNote, IonPage, IonTitle, IonToolbar, onIonViewWillEnter } from "@ionic/vue";
import { translate } from "@/i18n"
import { useGroupStore } from '@/store/groups';
import { computed } from "vue";

const groupStore = useGroupStore();
const currentGroupProcesses = computed(() => groupStore.getCurrentGroupProcesses)
const currentProcessGroup = computed(() => groupStore.getCurrentGroup);
const processGroups = computed(() =>groupStore.getProcessGroups);

async function onProcessGroupChange(group: any) {
  const selectedProcessGroupId = group.id
  const selectedProcessGroup = processGroups.value.find((group: any) => group.id === selectedProcessGroupId);
  groupStore.setcurrentProcessGroup(selectedProcessGroup);
  // Fetch and display process details for the selected group
  await groupStore.fetchProcessByGroups(selectedProcessGroupId);
}

onIonViewWillEnter(async () => {
  await groupStore.fetchProcessGroups();
});
</script>
