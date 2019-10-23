// let p = new CutePromise(resolve => {
//     setTimeout(() => resolve('Hello'), 100);
// });
// p.then(res => console.log(res));
// let my = new MyPromise(resolve => {
//     setTimeout(() => resolve('it is myPromise'), 100);
// });
// my.then(res =>{
//     console.log('res',res)
// });
// let p1 = new MyPromise((resolve, reject) => {
//     resolve('成功了');
// });
// let p2 = new MyPromise((resolve, reject) => {
//     resolve('success');
// });
// let p4 = new MyPromise((resolve,reject) => {
//     reject('失败了')
// });
let p5 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    },1000)
});

let p6 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject('failed')
    }, 500)
});
let p3 = new MyPromise();
// p3.all([p1,p2]).then(res=>{
//     console.log('res',res)
// });
// p3.all([p1,p2,p4]).then(res => {
//     console.log(res,'res')
// }).catch(err =>{
//     console.log('err',err)
// })
p3.race([p5,p6]).then(res =>{
    console.log(222,res)
}).catch(err =>{
    console.log('33',err)
});

