const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kakaoId: {
    type: Number,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    minLength: 2,
    maxLength: 8,
  },
  gender: {
    type: String,
    enum: ['남', '여', '기타'],
  },
  age: {
    type: String,
    enum: ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대 이상'],
  },
  region: {
    type: String,
    enum: [
      '서울',
      '경기',
      '인천',
      '강원',
      '충북',
      '충남',
      '세종',
      '대전',
      '경북',
      '경남',
      '대구',
      '울산',
      '부산',
      '전북',
      '전남',
      '광주',
      '제주',
    ],
  },
  reminder: {
    type: Date,
  },
  startWeek: {
    type: String,
    enum: ['일', '월'],
    default: '일',
  },
  balloons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Balloon' }],
  blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Block' }],
  diary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diary' }],
});

module.exports = mongoose.model('User', userSchema);
