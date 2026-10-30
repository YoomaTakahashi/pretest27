<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">จัดการตัวชี้วัด</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :error-messages="error.id_topic" :items="topics.map((t)=>({title:t.name_topic,value:t.id_topic}))"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-textarea label="ชื่อตัวชี้วัด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" rows="3"></v-textarea>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :error-messages="error.point_indicate" :items="[1,2,3,4,5]"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทตัวเลือก" v-model="form.point_indicate" :error-messages="error.point_indicate" :items="[1,2,3,4,5]"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="ma-2 text-center" color="primary" type="submit">{{ form.id_topic ? 'อัปเดต':'บันทึก' }}</v-btn>
                                        <v-btn class="ma-2 text-center" color="error" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-text-field label="ค้นหา" placeholder="ค้นหา" v-model="search" prepend-inner-icon="v-text-field"></v-text-field>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อหัวข้อการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>
                                             <v-btn class="text-center text-white ma-2" size="small" color="error" @click="del(items.id_topic)">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'


const error = ref<Record<string,string>>({})
const search = ref('')
const dataResult = ref([])
const form = ref({
    id_topic:null,
    name_topic:''
})
const reset = ()=>{
    form.value = {
        id_topic:null,
        name_topic:''
    }
}
const emailRegex = /^[^\s]+@[^\s]+[^\s]{2,}$/i
function validateForm(){
    const f = form.value
    error.value = {}

    if(!f.name_topic.trim())error.value.name_topic = 'กรุณากรอกชื่อหัวข้อการประเมิน'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{

    if(!validateForm())return
    const f = form.value
    try {

        f.id_topic
        ? await axios.put(`${staff}/topic/update/${f.id_topic}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/topic/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
        alert('ทำรายการสำเร็จ')

    } catch (error) {
        console.error("Error Save",error);   
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("Error get",error)
    }
}

const edit = (items:any)=>{
    form.value = {...items}
}

const del = async(id_topic:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/topic/delete/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error delete",error);
        
    }
}

const result = computed(()=>{

    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()

    return dataResult.value.filter((items:any)=>{
        return(
            items.name_topic.toLowerCase().includes(s)
        )
    })

})

onMounted(fetch)

</script>

<style scoped>

</style>