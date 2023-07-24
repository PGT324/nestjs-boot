const fetchData = async () => {
  console.time('===개별 Promise 각각===');
  //API 보내기 요청
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('성공');
    }, 2000);
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('성공');
    }, 3000);
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('성공');
    }, 1000);
  });
  console.timeEnd('===개별 Promise 각각===');
};

fetchData();

const fetchData2 = async () => {
  console.time('===한번에 Promise 각각===');
  const results = await Promise.all([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('성공');
      }, 2000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('성공');
      }, 3000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('성공');
      }, 1000);
    }),
  ]);

  console.log(results);
  console.timeEnd('===한번에 Promise 각각===');
};

fetchData2();
