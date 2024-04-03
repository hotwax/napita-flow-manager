<template>
	<ion-page>
		<ion-header @ionViewWillEnter="fetchProcessGroupData" :translucent="true">
			<ion-toolbar>
				<ion-menu-button slot="start" />
				<ion-title>{{ CurrentProcessGroup.name }}</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content>
			<!-- {{ CurrentProcessGroup }}			 -->
			<main>
				<div v-if="currentProcessGroupDetail && currentProcessGroupDetail.length">
					<div class="list-item" v-for="process in currentProcessGroupDetail" :key="process.id"
						:value="process.id">
						<ion-item>
							<ion-label class="ion-badge-container">
								{{ process.name }}
							</ion-label>
							<ion-badge slot="end" color="success"
								v-if="process.status === 'Running'">Running</ion-badge>
							<ion-badge slot="end" color="danger" v-if="process.status === 'Stopped'">Stopped</ion-badge>
						</ion-item>
					</div>
				</div>
				<div v-else>
					<p class="ion-text-center">{{ translate("No groups found") }}</p>
				</div>
			</main>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter, IonButton } from "@ionic/vue";
import { translate } from "@/i18n"
import { useUserStore } from '@/store/user';
import { computed, ref } from "vue";
import logger from './logger';

const userStore = useUserStore();
const CurrentProcessGroup = computed(() => userStore.getCurrentProcessGroup);
const currentProcessGroupDetail = ref([]) as any;

async function fetchProcessGroupData() {
	try {
		let root = userStore.getCurrentProcessGroup;
		root = root.id;
		currentProcessGroupDetail.value = await userStore.fetchProcessGroupFromParent(root); // Assuming this method exists in your pinia store to fetch process group data
	} catch (error) {
		logger.error('Error fetching process group data:', error);
	}
}

async function updateProcessStatus(process: any) {	
	let status = '';
	if (process.stoppedCount !== 0 || process.invalidCount !== 0) {
		status = 'Stopped'
	} else if (process.inputPortCount == 0 && process.runningCount != 0) {
		status = 'Running'
	} else if (process.inputPortCount !== 0 || process.outputPortCount !== 0) {
		if (process.inputPortCount!=0) {
			const currentProcessGroupConnectionId = await userStore.fetchProcessGroupConnection(process.id) //fetching the source-> groupId 
			const sourceProcess = currentProcessGroupDetail.value.find((source: any) => {
				return source.id === currentProcessGroupConnectionId.sourceId;
			});
			if (sourceProcess.status && sourceProcess.status === "Running") {
				status = 'Running'
			} else {
				if (sourceProcess.status && sourceProcess.status === "Stopped") {
					status = 'Stopped'
				} else {
					await updateProcessStatus(sourceProcess);
					const UpdatedsourceProcess = currentProcessGroupDetail.value.find((source: any) => {
						return source.id === sourceProcess.id;
					});
					console.log("Inpurtport:xcvbn", UpdatedsourceProcess);
					status = UpdatedsourceProcess.status;
				}
			}
		}
		if (process.outputPortCount!=0) {
			const currentProcessGroupConnectionId = await userStore.fetchProcessGroupConnection(process.id) //fetching the source-> groupId 
			const destinationProcess = currentProcessGroupDetail.value.find((destination: any) => {
				console.log("outputPort:", process.outputPortCount);
				return destination.id === currentProcessGroupConnectionId.destinationId;
			});
			if (destinationProcess.status && destinationProcess.status === "Running") {
				status = 'Running'
			} else {
				if (destinationProcess.status && destinationProcess.status === "Stopped") {
					status = 'Stopped'
				} else {
					await updateProcessStatus(destinationProcess);
					const UpdatedDestinationProcess = currentProcessGroupDetail.value.find((destination: any) => {
						return destination.id === destinationProcess.id;
					});
					console.log("outputPort:", UpdatedDestinationProcess);
					status = UpdatedDestinationProcess.status;
				}
			}
		}
	} else {
		status = 'Stopped';
	}
	return process.status = status;
}

async function processGroupStatus() {

	if (currentProcessGroupDetail) {
		currentProcessGroupDetail.value.map(async (process: any) => {
			await updateProcessStatus(process);
		}
		)
	}
}
onIonViewWillEnter(async () => {
	await fetchProcessGroupData();
	await processGroupStatus()
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
	grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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