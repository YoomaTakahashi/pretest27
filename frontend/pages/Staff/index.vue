<template>
    <v-container>
        <v-card elevation="5" rounded >
            <v-sheet elevation="5" rounded class="pa-5 py-4">
                <h1 class="font-weight-bold text-center">DashBoard - Staff</h1>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4" v-for="b in box" :key="b">
                            <v-card elevation="5" rounded="5"  class="pa-1 py-3 round">
                                <div class="text-h5 text-center pa-4"><h2 class="text-h5">{{ b.title }}</h2></div>
                                <div class="text-h5 text-center pa-4"><h3 class="text-h5">{{ b.value }}</h3></div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4" v-for="b in box2" :key="b">
                            <v-card elevation="5" rounded="5"  class="pa-1 py-3 round">
                                <div class="text-h5 text-center pa-4"><h2 class="text-h5">{{ b.title }}</h2></div>
                                <div class="text-h5 text-center pa-4"><h3 class="text-h5">{{ b.value }}</h3></div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-sheet>
        </v-card>


        <v-card class="mt-5" elevation="5" rounded >
            <v-sheet elevation="5" rounded class="pa-5 py-4">
                <h1 class="font-weight-bold text-center">ผู้รับการประเมินผลทั้งหมด</h1>
                <v-table class="mt-3">
                    <thead>
                        <tr>
                            <th class="border text-center">ลำดับ</th>
                            <th class="border text-center">ผู้รับการประเมินผล</th>
                            <th class="border text-center">รอบการประเมิน</th>
                            <th class="border text-center">วันที่ออกแบบประเมิน</th>
                            <!-- <th class="border text-center">เพิ่มกรรมการ</th> -->
                            <th class="border text-center">สถานะการประเมิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(items,index) in result" :key="items.id_eva">
                            <td class="border text-center">{{ index+1 }}</td>
                            <td class="border text-center">{{ formatDate(items.day_eva) }}</td>
                            <td class="border text-center">{{ items.fname }} {{ items.lname }}</td>
                            <td class="border text-center">รอบการประเมินที่:{{ items.round_sys }}  ปี:{{ items.year_sys }}</td>
                            <!-- <td class="border text-center"><v-btn class="text-center ma-2 text-white" color="success" @click="go(items.id_eva)">เพิ่มกรรมการ</v-btn></td> -->
                            <td class="border text-center">
                                <center>
                                    <v-btn class="text-center text-white" :color="bg(items.status_eva)">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง': items.status_eva === 2 ? 'รอกรรมการประเมิน' : 'ประเมินสำเร็จ' }}</v-btn>
                                </center>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="12" class="text-center text-red" v-if="result.length === 0">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva, staff } from '~/API/base';

const box = ref<any>([])
const box2 = ref<any>([])

const result = ref<any>([])

const fecth = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        box2.value = res.data.box2
    } catch (error) {
        console.error('ERROR GET BOX',error)
    }
}
const fecthround = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error('ERROR GET BOX',error)
    }
}

const bg = (status)=>{
    if(status === 1)return 'error'
    if(status === 2)return 'warning'
    if(status === 3)return 'success'
}

const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()+1).padStart(2,'0')
    const year = String(date.getFullYear())
    return `${day}/${month}/${year}`
}

onMounted(async()=>{
    await Promise.all([fecth(),fecthround()])
})
</script>

<style scoped>
.round{
    border-radius: 32px !important;
}
</style>