function MyPromise(executor) {
      let that = this;
      this.state = 'pending';//pending:进行中 resolve:成功  reject: 失败
      this.value = '';//存储成败或成功的返回值
      this.reason = '';
      this.resolveCallback = [];
      this.rejectCallback = [];
      //成功函数
      function resolve(result) {
          //实现promise不可逆
          if(that.state !== 'pending'){
              return
          }
          that.state = 'resolve';
          that.value = result;
          that.resolveCallback.forEach(item => {
              item();
          })
      }
      //失败函数
      function reject(error) {
          //实现promise不可逆
          if(that.state !== 'pending'){
              return
          }
          that.state = 'reject';
          that.reason = error;
          that.rejectCallback.forEach(fn => fn());
      }
      //自执行
      try {
          executor(resolve,reject);
      }catch (err) {
          reject(err)
      }

}
function resolvePromise(p2,x,resolve,reject) {
    if(p2 === x && x !== undefined){
        reject(new TypeError('类型错误'));
    }
    //可能是promise,看下对象中是否有then方法，如果有就是promise
    if(x !== null && (typeof x === "object" || typeof x === "function")){
        try {//为了防止出现{then:1 1}这种情况，需要判断then是不是一个函数
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,function (y) {
                    //y 可能还是一个promise，那就再去解析，直到返回一个普通值为止
                    resolvePromise(p2,y,resolve,reject);
                },function (err) {
                    reject(err);
                })
            }else {//如果then不是function，那可能是对象或常量
                reject(x);
            }
        }catch (e) {
            reject(e);
        }
    }else {//说明是一个普通量
        resolve(x);
    }
}
MyPromise.prototype.then = function(onFulfilled,onRejected){
    let that = this;
    let promise;
    onFulfilled = typeof onFulfilled === 'function'?onFulfilled:function (val) {
        return val
    };
    onRejected = typeof onRejected === 'function'?onRejected:function (err) {
        throw err;
    };
    if(this.state === 'resolve'){ //状态为成功时
        promise  = new MyPromise((resolve, reject)=>{

            // onFulfilled(that.value);
            let x = onFulfilled(that.value);
            resolvePromise(promise,x,resolve,reject);
        })

    }else if(this.state === 'reject'){ //状态为失败时
        promise  = new MyPromise((resolve, reject)=>{
            // onRejected(that.value);
            let x = onRejected(that.reason);
            resolvePromise(promise,x,resolve,reject);
        })
    }else{//状态为等待时
        promise  = new MyPromise((resolve, reject)=>{
            that.resolveCallback.push(function () {
                try {
                    let x = onFulfilled(that.value);
                    resolvePromise(promise,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            })
            that.rejectCallback.push(function () {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(promise,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            })
        })

    }
    return promise;
};
MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
};
MyPromise.prototype.all = function (promiseArr) {
    return new MyPromise((resolve,reject) => {
        let arr = [];//存放返回值
        let times = 0;
        function processResult(index,result) {
            arr[index] = result;
            times++;
            if(times === promiseArr.length){
                resolve(arr)
            }
        }
        for (let i = 0; i < promiseArr.length; i++){
            let result = promiseArr[i];
            if(typeof result.then === 'function'){
                result.then(function (res) {
                    processResult(i,res)
                },function (err) {
                    reject(err)
                })
            }else{
                resolve(i,result);
            }
        }
    })
};
MyPromise.prototype.race = function (promiseArr) {
      return new MyPromise((resolve,reject) => {
          promiseArr.forEach((item,index)=>{
              item.then(resolve,reject);
          })
      })
};

MyPromise.prototype.finally = function (callback) {
    return this.then((data) => {
        callback();
        return data;
    },(reason) => {
        callback();
        return reason;
    })
}
//链接https://www.imooc.com/article/30135
//https://blog.csdn.net/weixin_42755677/article/details/92384782
//https://www.jianshu.com/p/7e60fc1be1b2

