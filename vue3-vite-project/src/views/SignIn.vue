<template>
  <div class="container">
    <h1>あさめしアプリにログイン</h1>
    <p><input type="text" placeholder="メールアドレス" v-model="email"></p>
    <p><input type="password" placeholder="パスワード" v-model="password"></p>
    <p class="errorMsg" v-if="errMsg">{{ errMsg }}</p>
    <p><button @click="login" >ログイン</button></p>
  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email    = ref('');
const password = ref('');
const router   = useRouter();
const errMsg   = ref('');

const auth = getAuth();
async function login() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    alert(email.value + 'でサインインします！');

    console.log(auth.userCredential);
    router.push('/feed');
  } catch (error) {
    console.log(error.code)
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "メールアドレスが不正です";
        break;
      case "auth/invalid-credential":
        errMsg.value = "メールアドレスかパスワードが間違っています";
        break;
      case "auth/missing-password":
        errMsg.value = "パスワードが間違っています";
        break;
      case "auth/too-many-requests":
        errMsg.value = "リクエストが上限を超えました。時間を置いてから再度やり直してください";
        break;
    }
  }
}
</script>
