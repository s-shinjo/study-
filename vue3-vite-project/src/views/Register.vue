<template>
  <div class="container">
    <h1>あさめしアプリのアカウントを作成しよう</h1>

    <dl>
      <dt>メールアドレス&nbsp;：&nbsp;</dt>
      <dd><input type="text" placeholder="メールアドレス" v-model="email"></dd>

      <dt>パスワード&nbsp;：&nbsp;</dt>
      <dd><input type="password" placeholder="パスワード" v-model="password"></dd>

      <dt>ユーザー名&nbsp;：&nbsp;</dt>
      <dd><input type="text" placeholder="ユーザー名" v-model="user_name"></dd>

      <dt>プロフィールアイコン&nbsp;：&nbsp;</dt>
      <dd><input id="inputIcon" type="file" @change="handleFileChange"></dd>

      <dt>生年月日&nbsp;：&nbsp;</dt>
      <dd><input class="dateForm" type="date" placeholder="生年月日" v-model="birthday"></dd>

      <dt>性別&nbsp;：&nbsp;</dt>
      <dd>
        <input type="radio" name="sex" id="sex_m" v-model="sex" value="man" checked><label for="sex_m">男性</label>
        <input type="radio" name="sex" id="sex_w" v-model="sex" value="woman"><label for="sex_w">女性</label>
      </dd>
    </dl>

    <p>
      <input type="checkbox" id="check_agreement" v-model="isAgreement">
      <label for="check_agreement">&nbsp;利用規約への同意</label><br>
      <a href="https://www.notion.so/5452f89a493d44abb64a05f370313f6c?pvs=21" target="_blank">利用規約</a>
    </p>

    <p class="errorMsg" v-if="errMsg">{{ errMsg }}</p>
    <p><button :disabled="!isValidField()" @click="register">登録</button></p>
  </div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as storageRef } from 'firebase/storage'; // Firebase Storageのrefを別名でインポート

const email     = ref('');
const password  = ref('');
const user_name = ref('');
const birthday  = ref('1990-01-01');
const sex       = ref('man');
const isAgreement = ref(false);

const router = useRouter();
const errMsg = ref('');

const auth      = getAuth();
const firestore = getFirestore();
const storage   = getStorage();

// ファイルが選択されたときに呼ばれるハンドラ
let profileImageFile = null;
function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    profileImageFile = file;
  }
}

// 画像ファイルのURLを取得する
async function uploadProfileImage(userId, file) {
  // FirebaseのstorageRefを使用して参照を作成
  const ref = storageRef(storage, `profile_images/${userId}/${file.name}`);
  await uploadBytes(ref, file);

  const downloadURL = await getDownloadURL(ref);
  console.log('Profile Image URL:', downloadURL);

  return downloadURL;
}

// 入力チェック
function isValidField() {
  const isValid =    email.value.trim()     !== ''
                  && password.value.trim()  !== ''
                  && user_name.value.trim() !== ''
                  && birthday.value.trim()  !== ''
                  && isAgreement.value;
  return isValid;
}

async function register() {
  try {
    // メールとパスワードが正常ならAuthenticationにユーザーを作成
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // プロフィール画像をアップロードしてURLを取得
    const profileImageURL = profileImageFile ? await uploadProfileImage(auth.currentUser.uid, profileImageFile) : null;

    // ユーザーが正常に作成されたらFirestoreにデータを登録する
    const userCollection = collection(firestore, 'users');
    await addDoc(userCollection, {
      id           : auth.currentUser.uid,
      user_name    : user_name.value,
      email        : email.value,
      profile_icon : profileImageURL,
      birthday     : birthday.value,
      sex          : sex.value
    });

    alert(email.value + 'を登録しました！サインインします！');

    console.log(auth.currentUser);
    router.push('/feed');
  } catch (error) {
    console.error('Registration error:', error);
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    switch (error.code) {
      case "auth/missing-email":
      case "auth/invalid-email":
        errMsg.value = "正しいメールアドレスを入力してください";
        break;
      case "auth/missing-password":
        errMsg.value = "パスワードを入力してください";
        break;
      case "auth/weak-password":
        errMsg.value = "パスワードが短すぎます";
        break;
      case "auth/email-already-in-use":
        errMsg.value = "すでに登録済みのメールアドレスです";
        break;
    }
  }
}
</script>
