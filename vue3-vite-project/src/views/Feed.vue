<template>
  <div class="container">
    <h1>Feed</h1>
    <p>登録者だけが見れるページです</p>
    <p>ログインした方のみ閲覧が可能です</p>
    <!-- Firestoreから取得したデータを表示する部分 -->
    <div v-for="user in users" :key="user.id">
      <hr>
      <p>以下はFirestoreから取得したデータです</p>
      <dl>
        <dt><strong>メールアドレス&nbsp;：&nbsp;</strong></dt>
        <dd>{{ user.email }}<br></dd>

        <dt><strong>ユーザー名&nbsp;：&nbsp;</strong></dt>
        <dd>{{ user.userName }}<br></dd>

        <dt><strong>プロフィールアイコン&nbsp;：&nbsp;</strong></dt>
        <dd v-if="user.profileIcon"><img :src="user.profileIcon" alt="プロフィールアイコン" width="150px"><br></dd>
        <dd v-else>プロフィールアイコンなし<br></dd>

        <dt><strong>誕生日&nbsp;：&nbsp;</strong></dt>
        <dd>{{ user.birthday }}<br></dd>

        <dt><strong>性別&nbsp;：&nbsp;</strong></dt>
        <dd>{{ user.sex }}<br></dd>
      </dl>
      <hr>
    </div>
  </div>
</template>

<script setup>
import { db } from '../main.js';
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const users = ref([]);

// Firestoreからデータを取得する関数
async function fetchData() {
  const auth  = getAuth();
  const q = query(collection(db, 'users'), where('id', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  users.value = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email,
      userName: data.user_name,
      profileIcon: data.profile_icon,
      birthday: data.birthday,
      sex: data.sex,
    };
  });
}

// ページがマウントされた際にデータを取得
onMounted(() => {
  fetchData();
});
</script>
