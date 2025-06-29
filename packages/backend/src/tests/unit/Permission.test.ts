import { describe, expect, it } from "vitest";
import {
  Method,
  UserPermission,
  UserRole,
} from "../../infrastructure/permissions";
import { Routes } from "../../infrastructure/routes";
import { Permission } from "../../infrastructure/Permission";

describe("Permission test", () => {
  it("should throw an error when is not Role assigned ", () => {
    expect(() => {
      Permission.create("permission test", { roles: [] } as UserPermission);
    }).toThrowError(
      "Permission: permission test should contain at least one role",
    );
  });

  it("Should  throw an error when is not a valid Role", () => {
    expect(() => {
      Permission.create("permission test", {
        roles: ["no-valid-role"],
      } as unknown as UserPermission);
    }).toThrowError("Permission: permission test should has a valid role");
  });

  it("Should  throw an error when is not Path assigned ", () => {
    expect(() => {
      Permission.create("permission test", {
        roles: [UserRole.USER],
      } as UserPermission);
    }).toThrowError(
      "Permission: Permission should contain at least one path allowed",
    );
  });

  it("Should  throw an error when is not valid Path ", () => {
    expect(() => {
      Permission.create(" permission test", {
        roles: [UserRole.USER],
        path: "no-valid-path",
      } as unknown as UserPermission);
    }).toThrowError("Permission: Permission should have a valid path");
  });

  it("Should throw an error when hast not method", () => {
    expect(() => {
      Permission.create("permission test", {
        roles: [UserRole.USER],
        path: Routes.status,
      } as unknown as UserPermission);
    }).toThrowError(
      "Permission: permission test should contain at least one method",
    );
  });

  it("Should throw an error when method is not valid", () => {
    expect(() => {
      Permission.create("permission test", {
        roles: [UserRole.USER],
        path: Routes.status,
        methods: ["no-valid-method"],
      } as unknown as UserPermission);
    }).toThrowError(
      "Permission: permission test should contain a valid method",
    );
  });

  it("Add Roles to permission and should has permission for that role", () => {
    const permission = Permission.create(" permission test", {
      roles: [UserRole.USER],
      path: Routes.status,
      methods: [Method.GET],
    });

    expect(permission.hasRole(UserRole.USER)).toBe(true);
    expect(permission.hasPath(Routes.status)).toBe(true);
    expect(permission.hasPath(Routes.dashBoard)).toBe(false);
    expect(permission.hasMethod(Method.GET)).toBe(true);
  });

  it("Should has permissions when byPassAuth, method and path", () => {
    const permission = Permission.create(" permission test", {
      roles: [UserRole.USER],
      path: Routes.status,
      methods: [Method.GET],
      bypassAuth: true,
    });

    expect(permission.hasPermission(permission)).toBe(true);
  });

  it("Should return false with bypassAuth true, but not right path or method", () => {
    const userPermission: UserPermission = {
      roles: [UserRole.USER],
      path: Routes.status,
      methods: [Method.GET],
      bypassAuth: true,
    };

    const differentPathPermission = Permission.create("permissions-passed", {
      roles: [UserRole.USER],
      path: Routes.dashBoard,
      methods: [Method.GET],
    });

    expect(
      Permission.create("permission-test", userPermission).hasPermission(
        differentPathPermission,
      ),
    ).toBe(false);
  });
});
