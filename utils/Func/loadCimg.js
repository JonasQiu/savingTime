const db = wx.cloud.database()
const _ = db.command

function initCimg() {
    return new Promise((resolve, reject) => {
        let localImg = wx.getStorageSync('localImg')
        let reslist = {
            'HomePageSwiper': new Promise(async (resolve, reject) => {
                let obj = (await db.collection('Cimg').doc("HomePageSwiper").get()).data
                let resObj = {
                    version: '',
                    list: [],
                    swiperList: []
                }
                if (localImg.HomePageSwiper && obj.version == localImg.HomePageSwiper.version) {
                    // 无需更新
                    resObj = localImg.HomePageSwiper
                } else {
                    // 更新
                    resObj.version = obj.version
                    for (let i = 0; i < obj.list.length; i++) {
                        obj.list[i]['p'] = new Promise(async (resolve, reject) => {
                            let temp = await wx.cloud.downloadFile({
                                fileID: obj.list[i]['icon']
                            })
                            wx.saveFile({
                                tempFilePath: temp.tempFilePath,
                                success(res_save) {
                                    resolve(res_save.savedFilePath)
                                },
                                fail(res) {
                                    reject(res)
                                }
                            })
                        })
                    }
                    for (let i = 0; i < obj.list.length; i++) {
                        resObj.list[i] = {
                            'icon': await obj.list[i]['p'],
                            'name': obj.list[i]['name']
                        }
                    }
                    for (let i = 0; i < obj.swiperList.length; i++) {
                        obj.swiperList[i]['p'] = new Promise(async (resolve, reject) => {
                            let temp = await wx.cloud.downloadFile({
                                fileID: obj.swiperList[i]['img']
                            })
                            wx.saveFile({
                                tempFilePath: temp.tempFilePath,
                                success(res_save) {
                                    resolve(res_save.savedFilePath)
                                },
                                fail(res) {
                                    reject(res)
                                }
                            })
                        })
                    }
                    for (let i = 0; i < obj.swiperList.length; i++) {
                        resObj.swiperList[i] = {
                            'img': await obj.swiperList[i]['p'],
                            'name': obj.swiperList[i]['name']
                        }
                    }
                }
                resolve(resObj)
            }),
            'My': new Promise(async (resolve, reject) => {
                let obj = (await db.collection('Cimg').doc("My").get()).data
                let resObj = {
                    version: '',
                    gif: '',
                    list: [],
                    othericon: []
                }
                // 判断版本号
                if (localImg.My && obj.version == localImg.My.version) {
                    // 无需更新
                    resObj = localImg.My
                } else {
                    // 更新
                    resObj.version = obj.version
                    resObj['gif'] = await new Promise(async (resolve, reject) => {
                        let temp = await wx.cloud.downloadFile({
                            fileID: obj['gif']
                        })
                        wx.saveFile({
                            tempFilePath: temp.tempFilePath,
                            success(res_save) {
                                resolve(res_save.savedFilePath)
                            },
                            fail(res) {
                                reject(res)
                            }
                        })
                    })
                    for (let i = 0; i < obj.list.length; i++) {
                        obj.list[i]['p'] = new Promise(async (resolve, reject) => {
                            let temp = await wx.cloud.downloadFile({
                                fileID: obj.list[i]['icon']
                            })
                            wx.saveFile({
                                tempFilePath: temp.tempFilePath,
                                success(res_save) {
                                    resolve(res_save.savedFilePath)
                                },
                                fail(res) {
                                    reject(res)
                                }
                            })
                        })
                    }
                    for (let i = 0; i < obj.list.length; i++) {
                        resObj.list[i] = {
                            'icon': await obj.list[i]['p'],
                            'name': obj.list[i]['name']
                        }
                    }
                    for (let i = 0; i < obj.othericon.length; i++) {
                        obj.othericon[i]['p'] = new Promise(async (resolve, reject) => {
                            let temp = await wx.cloud.downloadFile({
                                fileID: obj.othericon[i]['icon']
                            })
                            wx.saveFile({
                                tempFilePath: temp.tempFilePath,
                                success(res_save) {
                                    resolve(res_save.savedFilePath)
                                },
                                fail(res) {
                                    reject(res)
                                }
                            })
                        })
                    }
                    for (let i = 0; i < obj.othericon.length; i++) {
                        resObj.othericon[i] = {
                            'img': await obj.othericon[i]['p'],
                            'name': obj.othericon[i]['name']
                        }
                    }
                }
                resolve(resObj)
            }),
        }
        resolve((async () => {
            reslist.HomePageSwiper = await reslist.HomePageSwiper
            reslist.My = await reslist.My
            wx.setStorageSync('localImg', reslist)
            return reslist
        })())
    })
}

function getHomePageSwiper() {
    let localImg = wx.getStorageSync('localImg')
    if (localImg.HomePageSwiper) {
        return localImg.HomePageSwiper
    } else {
        return []
    }
}

function getMy() {
    let localImg = wx.getStorageSync('localImg')
    if (localImg.My) {
        return localImg.My
    } else {
        return {}
    }
}

module.exports = {
    initCimg,
    getHomePageSwiper,
    getMy
}