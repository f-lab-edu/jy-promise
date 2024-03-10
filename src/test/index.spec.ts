/* eslint-disable jest/no-done-callback */
import { expect, test } from "@jest/globals";
import MyPromise from "../index";

test("Promise 콜백 후속 처리 메서드 `then` 테스트", (done) => {
  /**
   * @Given MyPromise 인스턴스 생성 및 결괏값 저장 변수 선언
   */
  const myPromiseResults: unknown[] = [];

  const myPromise1 = new MyPromise((resolve) => {
    resolve("SUCCESS!");
  });
  const myPromise2 = new MyPromise((_resolve, reject) => {
    reject("ERROR!");
  });

  /**
   * @When
   */
  myPromise1.then((res) => {
    myPromiseResults.push(res);
  });
  myPromise2.then(
    () => {},
    (err) => {
      myPromiseResults.push(err);
    },
  );

  /**
   * @Then
   */
  setTimeout(() => {
    expect(myPromiseResults).toEqual(["SUCCESS!", "ERROR!"]);
    done();
  });
});

test("Promise 우선 순위 비교", (done) => {
  /**
   * @Given 출력 값을 저장할 배열생성
   */
  const printedValues: number[] = [];

  /**
   * @When MyPromise 객체 생성
   */
  const myPromise = new Promise<number>((resolve) => {
    resolve(1);
  });

  /**
   * @Then
   */
  myPromise.then((result) => printedValues.push(result));
  printedValues.push(2);
  setTimeout(() => printedValues.push(3));

  setTimeout(() => {
    expect(printedValues).toEqual([2, 1, 3]);
    done();
  });
});
