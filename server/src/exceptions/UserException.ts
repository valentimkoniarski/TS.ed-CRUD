import {Conflict, Unauthorized} from "@tsed/exceptions";

export class InvalidTokenException extends Unauthorized {
  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super("Invalid token");
    }
  }
}

export class InvalidCredentialsException extends Unauthorized {
  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super("Invalid credentials");
    }
  }
}

export class UserAlreadyExistsException extends Conflict {
  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super("User already exists");
    }
  }
}
