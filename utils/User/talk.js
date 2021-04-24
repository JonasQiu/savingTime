const GoEasyIM = require('../Func/goeasy')
let im = null

// 初始化goeasy
function initGoeasy(option) {
  var options = {
    host: 'hangzhou.goeasy.io',
    appkey: "BC-dc03b5a1ed474d9b913054670631e26b"
  }
  //初始化
  let ima = GoEasyIM.getInstance(options);
  var user = {
    id: option._id,
    data: {
      avatar: option.avatarUrl,
      nickname: option.nickname
    } //当前用户的扩展数据, 任意格式的字符串或者对象，用于会话列表conversation.data和群消息的senderData
  }
  //连接GoEasy
  var promise = ima.connect(user);
  promise.then(function () {
    console.log("初始化连接成功");
  }).catch(function (error) {
    console.log("初始化连接失败, code:" + error.code + " content:" + error.content);
  });
  im = promise
  return promise
}

// 发送信息
function sendMess(option) {
  let {
    groupId,
    msgStr,
    avatar,
    nickname
  } = option
  //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
  let textMessage = im.createTextMessage({
    text: msgStr, //消息内容
    to: {
      type: GoEasyIM.SCENE.GROUP, //私聊还是群聊，私聊为GoEasyIM.SCENE.PRIVATE
      id: groupId, //群id
      data: {
        avatar,
        nickname
      } //群信息, 任意格式的字符串或者对象，用于更新会话列表中的群信息conversation.data
    }
  });
  //发送消息
  var promise = im.sendMessage(textMessage);
  promise.then(function (message) {
    console.log("发送信息成功", message);
  }).catch(function (error) {
    console.log("发送信息失败, code:" + error.code + " content:" + error.content);
  });
}

// 接收订阅群聊消息
function subscribeGroup(option) {
  let {
    groupIds,
    onMessage
  } = option

  //接收群消息
  im.on(GoEasyIM.EVENT.GROUP_MESSAGE_RECEIVED, onMessage);
  //订阅群消息
  var promise = im.subscribeGroup(groupIds);
  promise.then(function () {
    console.log("群信息订阅成功");
    return '群信息订阅成功'
  }).catch(function (error) {
    console.log("群信息订阅失败, code:" + error.code + " content:" + error.content);
    return '群信息订阅失败'
  });
}

// 取消订阅群聊消息
function unsubscribeGroup(userId) {
  //取消订阅群聊消息
  var promise = im.unsubscribeGroup(userId);
  promise.then(function () {
    console.log("群信息取消订阅成功");
    return true
  }).catch(function (error) {
    console.log("群信息取消订阅失败, code:" + error.code + " content:" + error.content);
    return false
  });
}

export default {
  initGoeasy,
  sendMess,
  subscribeGroup,
  unsubscribeGroup
}