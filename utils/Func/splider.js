// 抓取豆瓣读书中的数据信息
const axios = require('axios')
const cheerio = require('cheerio');
/**
 * 获取豆瓣读书网页的源代码
 */
async function getBooksHTML(url) {
  const resp = await axios.get(url);
  const $ = cheerio.load(resp.data);
  return $;
}

/**
 * 从豆瓣读书中得到一个完整的网页，并从网页中分析出书籍的基本信息，然后得到一个书籍的详情页链接数组
 */
async function getBookLinks(ele) {
  const $ =await getBooksHTML('https://bj.58.com/dianqi/?utm_source=link&spm=u-2edwzcszywgurvesg.2eef657vtwgt4eurg&PGTID=0d202140-0000-11e7-abdf-e6b940ff0adb&ClickID=3');
  const achorElements = $(ele);
  const links = achorElements
    .map((i, ele) => {
      const href = ele.attribs["href"];
      return href;
    })
    .get();
  return links;
}
/**
 * 根据书籍详情页的地址，得到该书籍的详细信息
 * @param {*} detailUrl
 */
async function getBookDetail(detailUrl) {
  const $ = await getBooksHTML(detailUrl);
  const achorElements = await getBookLinks("#content_sumary_left .switch__big-img ._groupImg_big img")
  
    console.log(achorElements);
    return
  // const name = $("h1").text().trim();

  // const serverClass       //服务类别
  // const serverArea  //服务区域  
  // const contacter   //联系人
  // const storeAddress       //商店地址
  // const telphone    //联系电话
  // const detailInfo  //详情描述
  // const serverDemo  //服务项目
  // const comment     //评价
  // const serverFeature   //服务特色
  // const serverArea      //服务区域

  // const spans = $("#info span.pl");
  // const authorSpan = spans.filter((i, ele) => {
  //   return $(ele).text().includes("作者");
  // });
  // const author = authorSpan.next("a").text();
  // const publishSpan = spans.filter((i, ele) => {
  //   return $(ele).text().includes("出版年");
  // });
  // const publishDate = publishSpan[0].nextSibling.nodeValue.trim();
  // return {
  //   name,
  //   imgurl,
  //   publishDate,
  //   author,
  // };
}

/**
 * 获取所有的书籍信息
 */
async function fetchAll() {
  const links = await getBookLinks("#jingzhun tr.new-list.ac_item td.img div.ac_linkurl a"); //得到书籍的详情页地址
  // console.log(links);
  const proms = links.map((link) => {
    return getBookDetail(link);
  });
  return Promise.all(proms);
}

/**
 * 得到书籍信息，然后保存到数据库
 */
async function saveToDB() {
  const books = await fetchAll();
  // console.log(books);
  return books
}

saveToDB()