<template>
  <ion-page>
    <ion-header @ionViewWillEnter="fetchProcessGroupData" :translucent="true">
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
          <div>
            <ion-accordion-group>
              <ion-radio-group >
                <ion-accordion v-for="(process, index) in currentProcessBygroupDetail" :key="index" >
                  <ion-item slot="header">
                    <ion-label class="ion-text-wrap">
                      {{ process.name }}
                    </ion-label>
                  </ion-item>
                  <div class="ion-padding" slot="content">
                    
                  </div>
                </ion-accordion>
              </ion-radio-group>
            </ion-accordion-group>
          </div>
        </main>
        <!-- <main v-else class="empty-state">
          <p>{{ "Select a process group to view its details" }}</p>
        </main> -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter, IonButton } from "@ionic/vue";
import { translate } from "../i18n"
import { useGroupStore } from '../store/groups';
import { computed, ref } from "vue";

const groupStore = useGroupStore();
let CurrentProcessGroup = ref('') as any;
const currentProcessBygroupDetail = computed(() => groupStore.getProcessByGroups)
CurrentProcessGroup = computed(() => groupStore.getCurrentProcessGroup);
const processGroups = groupStore.getProcessGroups;

function fetchProcessGroups() {
  return groupStore.fetchProcessGroups();
}

async function fetchProcessByGroups(groupId: string) {
  await groupStore.fetchProcessByGroups(groupId);

}

async function onProcessGroupChange(group: any) {
  const selectedProcessGroupId = group.id
  const selectedProcessGroup = processGroups.find(group => group.id === selectedProcessGroupId);

  groupStore.setCurrentProcessGroup(selectedProcessGroup);
  // Fetch and display process details for the selected group
  await fetchProcessByGroups(selectedProcessGroupId); 
}

onIonViewWillEnter(async () => {
  await fetchProcessGroups();
});
</script>

<style scoped>
ion-card>ion-button {
  margin: var(--spacer-xs);
}

section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: start;
}

.user-profile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

hr {
  border-top: 1px solid var(--border-medium);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacer-xs) 10px 0px;
}
</style>