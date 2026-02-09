import { UserPermission } from './user-permission.enum';

export interface GrpcUser {
  uuid: string;
  email: string;
  userPermission: UserPermission;
}
