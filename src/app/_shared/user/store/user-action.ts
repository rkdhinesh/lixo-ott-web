import { User } from "../model/user";

export class AddUser {
  static type = "[USER] AddUser";
  constructor(public readonly user: User) {}
}

export class DeleteUser {
  static type = "[USER] DeleteUser";
  constructor(public readonly userId: string) {}
}
export class DeleteUsers {
  static type = "[USER] DeleteUsers";
  constructor() {}
}
export class UpdateUser {
  static type = "[USER] UpdateUser";
  constructor(public readonly user: User) {}
}
