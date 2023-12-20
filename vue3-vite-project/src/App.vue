<template>
  <div class="navigation">
    <p v-if="isLoggedIn">{{ currentUser_email }}でログイン中</p>
    <nav v-if="isLoggedIn">
      <router-link to="/">ホーム</router-link> |
      <router-link to="/feed">フィード</router-link> |
      <router-link to="/record">レコード</router-link> |
      <button @click="handleSignOut">サインアウト</button>
    </nav>
    <nav v-else>
      <router-link to="/">ホーム</router-link> |
      <router-link to="/register">登録</router-link> |
      <router-link to="/sign-in">サインイン</router-link>
    </nav>
  </div>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const currentUser_email = ref('');

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      currentUser_email.value = ref(auth.currentUser.email);
    } else {
      isLoggedIn.value = false;
    }
  });
});

function handleSignOut() {
  signOut(auth).then(() => {
    alert('サインアウトします！');
    router.push('/sign-in');
  }).catch((error) => {
    console.log(error);
  });
}
</script>
