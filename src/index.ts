/* eslint-disable @typescript-eslint/no-explicit-any */
type PromiseStatus = "pending" | "fulfilled" | "rejected";

type Resolve<T = unknown> = (value: T) => void;
type Reject = (reason?: any) => void;
type Executor<T = unknown> = (resolve: Resolve<T>, reject: Reject) => void;

type OnFulfilled<ResolveValue, Result> = (value: ResolveValue) => Result;
type OnRejected<Result = never> = (reason: any) => Result;

export default class MyPromise<T = unknown> {
  private _status: PromiseStatus;
  private _result!: T;
  private _onFulfilledCallbacks: OnFulfilled<T, unknown>[] = [];
  private _onRejectedCallbacks: OnRejected<unknown>[] = [];

  constructor(promiseCallback: Executor<T>) {
    this._status = "pending";

    const resolve: Resolve<T> = (value) => {
      if (this._status === "pending") {
        this._status = "fulfilled";
        this._result = value;
        this._onFulfilledCallbacks.forEach((fn) => fn(value));
      }
    };

    const reject: Reject = (value) => {
      if (this._status === "pending") {
        this._status = "rejected";
        this._result = value;
        this._onRejectedCallbacks.forEach((fn) => fn(value));
      }
    };

    try {
      promiseCallback(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private processFulfilledStatus<TResult = T>(
    resolve: Resolve<TResult>,
    reject: Reject,
    onFulfilled?: OnFulfilled<T, TResult>,
  ) {
    try {
      const fulfilledResult = (onFulfilled ? onFulfilled(this._result) : this._result) as TResult;
      if (fulfilledResult instanceof MyPromise) {
        fulfilledResult.then(resolve, reject);
      } else {
        resolve(fulfilledResult);
      }
    } catch (error) {
      reject(error);
    }
  }

  private processRejectedStatus<TResult1 = T, TResult2 = never>(
    resolve: Resolve<TResult1>,
    reject: Reject,
    onRejected?: OnRejected<TResult2>,
  ) {
    try {
      const asyncThenRejectResult = onRejected ? onRejected(this._result) : this._result;
      if (asyncThenRejectResult instanceof MyPromise) {
        asyncThenRejectResult.then(resolve, reject);
      } else {
        reject(asyncThenRejectResult);
      }
    } catch (error) {
      reject(error);
    }
  }

  then<TResult1 = T, TResult2 = never>(onFulfilled?: OnFulfilled<T, TResult1>, onRejected?: OnRejected<TResult2>) {
    return new MyPromise<TResult1>((resolve, reject) => {
      /**
       * 비동기 처리 함수 내부에서 `resolve`, `reject` 호출시
       * `Promise` 후속 처리 콜백 메소드 배열에 추가 후, 상태 변경시 호출
       */
      if (this._status === "pending") {
        this._onFulfilledCallbacks.push(() => this.processFulfilledStatus(resolve, reject, onFulfilled));

        this._onRejectedCallbacks.push(() => this.processRejectedStatus(resolve, reject, onRejected));
        return;
      }

      if (this._status === "fulfilled") {
        this.processFulfilledStatus(resolve, reject, onFulfilled);
      } else if (this._status === "rejected") {
        this.processRejectedStatus(resolve, reject, onRejected);
      }
    });
  }

  catch<TResult = never>(onRejected?: OnRejected<TResult>) {
    return new MyPromise<TResult>((resolve, reject) => {
      if (this._status === "pending") {
        this._onRejectedCallbacks.push(() => this.processRejectedStatus(resolve, reject, onRejected));
        return;
      }

      if (this._status === "rejected") {
        this.processRejectedStatus(resolve, reject, onRejected);
      }
    });
  }
}
