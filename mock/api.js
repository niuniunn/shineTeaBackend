import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';

const proxy = {
  'POST /api/apply/submit': (req, res) => {
    res.send({ code: 0, tip:'操作成功' });
  },
  'POST /api/schedule/list': (req,res) => {
    res.send({
      code: 0,
      tip: '操作成功',
      data: [
        {
          key:1,
          no:1,
          userName:'邹江华',
          dept:'技术开发室',
          startTime:'2019-09-02 10:',
          endTime:'2019-09-02 10:',
          type:'xxx',
          detail:'xxxxx'
        },
        {
          key:2,
          no:1,
          userName:'邹江华',
          dept:'技术开发室',
          startTime:'2019-09-02 10:',
          endTime:'2019-09-02 10:',
          type:'xxx',
          detail:'xxxxx'
        }
      ]
    });
  },
  'POST /api/back/schedule/search':(req,res) => {
    res.send({
      code: 0,
      tip: '操作成功',
      data: [
        {
          no:1,
          name:'邹江华',
          department:'技术开发室',
          begin_time:'2019-09-02 10:',
          end_time:'2019-09-02 10:',
          title:'飞行',
          content:'xxxxx'
        },
        {
          no:2,
          name:'邹江华',
          department:'技术开发室',
          begin_time:'2019-09-02 10:',
          end_time:'2019-09-02 10:',
          content:'xxxxx'
        },
        {
          no:3,
          name:'邹江华',
          department:'技术开发室',
          begin_time:'2019-09-02 10:',
          end_time:'2019-09-02 10:',
          content:'xxxxx'
        },
      ],
      pagination:{
        count:3
      }
    });
  },
  'GET /api/back/schedule/getInfo':(req,res) => {
    res.send({
      code: 0,
      tip: '操作成功',
      data: {}
    })
  }
};

export default delay(proxy,1000);
