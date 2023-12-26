<template>
  <div class="container">
    <p><input class="dateForm" v-model="inputDate" type="date" placeholder="日付"></p>
    <p><input v-model="exerciseName" type="text" placeholder="種目名"></p>

    <!-- 重量と回数の入力フォーム -->
    <div v-for="(row, index) in rows" :key="index">
      <p>
        <input v-model="row.weight" type="text" size="3" placeholder="重量"> kg ×
        <input v-model="row.reps" type="text" size="2" placeholder="回数"> 回
        <button id="plusButton"  v-if="index==0" @click="addRow">+</button>
        <button id="minusButton" v-else @click="removeRow(index)">-</button>
      </p>
    </div>

    <!-- 登録ボタン -->
    <button @click="register">登録</button>

    <!-- 絞り込み機能 -->
    <div v-if="forms.length > 0">
      <br>
      <input type="checkbox" id="check_pullDownDates" v-model="isCheckedPullDownDates"  @change="getPullDownDates">
      <label for="check_pullDownDates">日付で絞る</label>
      <br>
      <select class="pullDown-001" v-if="isCheckedPullDownDates" v-model="selectedPullDownDate" @change="getPullDownDates">
        <option v-for="date in pullDownDates" v-bind:value="date" v-bind:key="date">
          {{ date }}
        </option>
      </select>
    </div>

    <!-- 登録データ表示用 -->
    <hr v-if="forms.length > 0" />
    <div v-for="form in forms" :key="form.id">
      <template v-if="!isCheckedPullDownDates || form.inputDate === selectedPullDownDate">
        {{ form.inputDate }}<br>{{ form.exerciseName }}
        <div v-for="(row, index) in form.rows" :key="index">
          {{ row.weight }}kg × {{ row.reps }}回
        </div>
        <button id="removeButton" @click="removeRegisteredData(form)">削除</button>
        <hr>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getDatabase, ref as dbRef, push, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

// Firebase Realtime Database の参照を取得
const database = getDatabase();

// 変数宣言
const inputDate = ref(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }).split(' ')[0].split('/').join('-')); //現在日付
const exerciseName = ref('');
const rows  = ref([{ weight: '', reps: '' }]);
const forms = ref([]);
const isCheckedPullDownDates = ref(false);
const selectedPullDownDate = ref('');
const pullDownDates = ref([]);

function getPullDownDates() {
  // 選択日付が削除され0件になった場合、初期値を最新日にする
  const exists = forms.value.some((form) => {
    return form.inputDate == selectedPullDownDate.value;
  })
  if (!exists) {
    selectedPullDownDate.value = forms.value[0].inputDate
  }
  
  // 重複なしで日付をセット
  const dates = forms.value.map((form) => {
    return form.inputDate;
  });
  pullDownDates.value = [...new Set(dates)];
}

// 入力フォームを追加
function addRow() {
  rows.value.push({ weight: '', reps: '' });
}
// 入力フォームを削除
function removeRow(index) {
  rows.value.splice(index, 1);
}

// 入力フォームの内容を登録
function register() {
  const nowDate = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
  const newFormRef = push(dbRef(database, auth.currentUser.uid), {
    inputDate: inputDate.value.split('-').join('/'),
    exerciseName: exerciseName.value,
    rows: rows.value.slice(),
    updated: nowDate, //追加
  });

  // フォームをクリア
  exerciseName.value = '';
  rows.value = [{ weight: '', reps: '' }];
}

// 入力フォームの内容を削除
function removeRegisteredData(form) {
  const formRef = dbRef(database, `${auth.currentUser.uid}/${form.id}`);
  remove(formRef);
}

// 画面の呼び出し時・登録ボタン押下時にDBデータを取得し画面出力する
onValue(dbRef(database, auth.currentUser.uid), (snapshot) => {
  forms.value = [];
  const data = snapshot.val();
  if (data) {
    // フォーム内容取得
    Object.keys(data).forEach((key) => {
      forms.value.push({
        id: key,
        inputDate: data[key].inputDate,
        exerciseName: data[key].exerciseName,
        rows: data[key].rows,
        updated: data[key].updated, //追加
      });
    });
  
    //日付でソート
    forms.value.sort((a, b) => {
      // inputDateで降順にソート
      if (a.inputDate > b.inputDate) {
        return -1;
      } else if (a.inputDate < b.inputDate) {
        return 1;
      }

      // inputDateが同じならupdatedで降順にソート
      if (a.updated > b.updated) {
        return -1;
      } else if (a.updated < b.updated) {
        return 1;
      }
    });

    // プルダウンも更新しておく
    getPullDownDates();
  }
});
</script>
