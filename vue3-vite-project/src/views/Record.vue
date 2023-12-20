<template>
  <div class="container">
    <p><input v-model="inputDate" type="date" id="inputDate" placeholder="日付"></p>
    <p><input v-model="exerciseName" type="text" placeholder="種目名"></p>

    <!-- 重量と回数の入力フォーム -->
    <div v-for="(row, index) in rows" :key="index">
      <p>
        <input v-model="row.weight" type="text" size="3" placeholder="重量"> kg ×
        <input v-model="row.reps" type="text" size="2" placeholder="回数"> 回
        <button v-if="index==0" @click="addRow">+</button>
        <button v-else @click="removeRow(index)">-</button>
      </p>
    </div>

    <!-- 登録ボタン -->
    <button @click="register">登録</button>
    
    <!-- 登録データ表示用 -->
    <hr v-if="forms.length > 0" />
    <div v-for="form in forms" :key="form.id">
      {{ form.inputDate }}<br>{{ form.exerciseName }}
      <div v-for="(row, index) in form.rows" :key="index">
        {{ row.weight }}kg × {{ row.reps }}回
      </div>
      <button @click="removeRegisteredData(form)">削除</button>
      <hr>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 今日の日付を取得
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

// 変数宣言
const inputDate = ref(formattedDate);
const exerciseName = ref('');
const rows  = ref([{ weight: '', reps: '' }]);
const forms = ref([]);

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
  forms.value.push({
    inputDate: inputDate.value.split('-').join('/'),
    exerciseName: exerciseName.value,
    rows: rows.value.slice(), // フォームをコピーして格納
  });

  // 登録後にフォームをリセットする
  // exerciseName.value = '';
  rows.value = [{ weight: '', reps: '' }];
}
// 入力フォームの内容を削除
function removeRegisteredData(field) {
  forms.value = forms.value.filter((item) => item !== field);
}
</script>
