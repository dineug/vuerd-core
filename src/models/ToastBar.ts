import { uuid } from "@/ts/util";

export interface ToastBar {
  message: string;
  millisecond?: number;
}

export default class ToastBarImpl implements ToastBar {
  public id: string = uuid();
  public message: string;
  public millisecond: number = 3000;

  constructor(toastBar: ToastBar) {
    this.message = toastBar.message;
    if (toastBar.millisecond !== undefined) {
      this.millisecond = toastBar.millisecond;
    }
  }
}
