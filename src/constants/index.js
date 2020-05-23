export const SET_RUNTIME_VARIABLE = 'SET_RUNTIME_VARIABLE';

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
export const ACTOR = {
  ADMIN: 'admin',
  LECTURER: 'lecturer',
  STUDENT: 'student',
};
export class Role {
  static ADMIN = 'admin';
  static SUPER_ADMIN = 'super_admin';
  static LECTURER = 'lecturer';
  static STUDENT = 'student';
  static VERIFIER = 'verifier';

  static getAdminRoles() {
    return [this.ADMIN, this.SUPER_ADMIN];
  }

  static requiredLoginRoles() {
    return [this.SUPER_ADMIN, this.ADMIN, this.LECTURER, this.STUDENT];
  }

  static getAll() {
    return [this.SUPER_ADMIN, this.ADMIN, this.LECTURER, this.STUDENT, this.VERIFIER];
  }
}
