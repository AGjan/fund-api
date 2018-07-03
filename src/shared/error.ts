export default class Rejection extends Error {
  message: string;
  status: number;
  time: Date;

  constructor({ message, status }) {
    super(message);
    this.message = message;
    this.status = status;
    this.time = new Date();
    Error.captureStackTrace(this);
  }
}
