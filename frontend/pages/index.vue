<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card color="#7d0c14">
          <v-card-title>
            <center><v-img src="/img/logo.png" width="20%" class="mt-3"></v-img></center>
            <h1 class="text-center">เข้าสู่ระบบ</h1>
            <h2 class="text-center">NTC Evaluation System</h2>
            <h2 class="text-center">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</h2>
          </v-card-title>
          <v-card-text class="bg-white">
            <br>
            <v-alert v-if="error" variant="tonal" type="error">{{ error }}</v-alert>
            <v-form @submit.prevent="login">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="ชื่อผู้ใช้" v-model="username" prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="รหัสผ่าน" v-model="password" :prepend-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw ? 'text' : 'password'" @click:prepend-inner="show = !show; showPw = !showPw"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select label="ประเภทสมาชิก" v-model="role" :items="typeR" prepend-inner-icon="mdi-account-group"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn class="ma-2" color="primary" type="submit">เข้าสู่ระบบ</v-btn>
                  <v-btn class="ma-2" color="error" type="reset">ยกเลิก</v-btn>
                </v-col>
              </v-row>
            </v-form>
            <nuxt-link to="/regis" class="text-center text-blue text-decoration-none"><p>หากไม่มีบัญชี? สมัครสมาชิก</p></nuxt-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import auth from '~/API/auth'

definePageMeta({ layout: false })

const error = ref('')
const typeR = ['ฝ่ายบุคลากร', 'ผู้รับการประเมินผล', 'กรรมการประเมิน']
const show = ref(false)
const showPw = ref(false)
const username = ref('')
const password = ref('')
const role = ref('')

const login = async () => {
  error.value = ''
  const router = useRouter()
  try {
    const res = await auth.login({
      username: username.value.trim(),
      password: password.value,
      role: role.value
    })
    localStorage.setItem('token', res.data.token)
    if (res.data.role === 'ฝ่ายบุคลากร') await router.push('/Staff')
    else if (res.data.role === 'ผู้รับการประเมินผล') await router.push('/Evaluatee')
    else if (res.data.role === 'กรรมการประเมิน') await router.push('/Committee')
    else throw new Error('ไม่รู้จักประเภทสมาชิก')
  } catch (err: any) {
    localStorage.removeItem('token')
    console.error('Error login', err)
    error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
  }
}
</script>
