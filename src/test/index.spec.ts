import { expect, test } from "@jest/globals";
// import MyPromise from "../index";

// eslint-disable-next-line jest/no-done-callback
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
