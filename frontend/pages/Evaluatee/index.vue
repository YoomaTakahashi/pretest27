<template>
    <v-container>
        <v-card elevation="5" rounded >
            <v-sheet elevation="5" rounded class="pa-5 py-4">
                <h1 class="font-weight-bold text-center">DashBoard - Evaluatee</h1>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4" v-for="b in box" :key="b">
                            <div class="text-h5 text-center pa-4">{{ b.title }}</div>
                            <div class="text-h5 text-center pa-4">{{ b.value }}</div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-sheet>
        </v-card>


        <v-card class="mt-5" elevation="5" rounded >
            <v-sheet elevation="5" rounded class="pa-5 py-4">
                <h1 class="font-weight-bold text-center">DashBoard - Evaluatee</h1>
                <v-table class="table">
                    <tr>
                        <th class="bg-grey p-2 border" style="width: 10%;">ลำดับ</th>
                        <th class="bg-grey p-2 border" style="width: 10%;">ชื่อ - นามสกุล</th>
                        <th class="bg-grey p-2 border" style="width: 10%;">รอบการประเมินที่</th>
                        <th class="bg-grey p-2 border" style="width: 10%;">ปีการประเมิน</th>
                    </tr>
                    <tr v-for="r in round" :key="r">
                        <td class="text-center border pa-2" style="width: 10%;">{{ 1 }}</td>
                        <td class="text-center border pa-2" style="width: 10%;">{{ r.fname }}-{{ r.lname }}</td>
                        <td class="text-center border pa-2" style="width: 10%;">{{ r.round_sys }}</td>
                        <td class="text-center border pa-2" style="width: 10%;">{{ r.year_sys }}</td>
                    </tr>
                </v-table>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva } from '~/API/base';

const box = ref<any>([])
</script>

<style scoped>

</style>