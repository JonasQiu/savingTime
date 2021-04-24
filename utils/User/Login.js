const app = getApp()

function Login(userInfo) {
        return new Promise((resolve, reject) => {
                wx.cloud.callFunction({
                        name: 'login',
                        data: {
                                userInfo
                        }
                }).then(res => {
                        // console.log('util的login的then的userinfo',res.result.userInfo);
                        resolve(res.result.userInfo)
                }).catch(res => {
                        reject('util的login错误', res)
                })
        })
}
module.exports = {
        Login,
}