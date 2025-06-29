import { Method, UserPermission, UserRole } from "./permissions";
import { Routes } from "./routes";

export class Permission {
  private static permissionName: string;
  constructor(
    readonly path: Routes,
    readonly methods: Method[],
    private readonly roles: UserRole[],
    private readonly bypassAuth?: boolean,
  ) {}

  static create(name: string, permission: UserPermission): Permission {
    this.permissionName = name;
    this.validate(permission);
    return new Permission(
      permission.path,
      permission.methods,
      permission.roles,
      permission.bypassAuth,
    );
  }

  // TODO create static createFromRequest

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  hasPath(path: Routes): boolean {
    return this.path === path;
  }

  hasMethod(method: Method): boolean {
    return this.methods.includes(method);
  }

  hasPermission(passedPermission: Permission): boolean {
    if (
      this.bypassAuth === true &&
      passedPermission.path === this.path &&
      this.containMethod(passedPermission.methods)
    ) {
      return true;
    }

    return false;
  }

  private containMethod(methods: Method[]): boolean {
    return methods.some((m) => Object.values(Method).includes(m));
  }

  private static validate(permission: UserPermission): void {
    this.validateRole(permission.roles);
    this.validatePath(permission.path);
    this.validateMethod(permission.methods);
  }

  private static validateMethod(methods: Method[]): void {
    if (methods === undefined || methods.length === 0) {
      throw new Error(
        `Permission: ${this.permissionName} should contain at least one method`,
      );
    }

    if (!methods.some((m) => Object.values(Method).includes(m))) {
      throw new Error(
        `Permission: ${this.permissionName} should contain a valid method`,
      );
    }
  }

  private static validateRole(roles: UserRole[]): void {
    if (roles.length === 0) {
      throw new Error(
        `Permission: ${this.permissionName} should contain at least one role`,
      );
    }

    if (!roles.some((role) => Object.values(UserRole).includes(role))) {
      throw new Error(
        `Permission: ${this.permissionName} should has a valid role`,
      );
    }
  }

  private static validatePath(path: Routes): void {
    if (!path) {
      throw new Error(
        `Permission: ${this.name} should contain at least one path allowed`,
      );
    }

    if (!Object.values(Routes).includes(path)) {
      throw new Error(`Permission: ${this.name} should have a valid path`);
    }
  }
}
