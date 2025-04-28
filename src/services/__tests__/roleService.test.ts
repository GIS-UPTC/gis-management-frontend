import { roleService, RoleServiceError } from '../roleService';
import api from '../api';
import { Role } from '@/types/models/GeneralModels';

// Mock the api module
jest.mock('../api');

describe('roleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchRoles', () => {
    it('should successfully fetch roles by name', async () => {
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'Admin',
          is_active: true,
          accesses: [{ id: 1, name: 'users' }]
        }
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockRoles });

      const result = await roleService.searchRoles('Admin');
      
      expect(api.get).toHaveBeenCalledWith('/roles/Admin?with_inactives=false');
      expect(result).toEqual(mockRoles);
    });

    it('should handle errors when searching roles', async () => {
      const error = new Error('Network error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      const result = await roleService.searchRoles('Admin');
      
      expect(result).toBeInstanceOf(RoleServiceError);
      if (result instanceof RoleServiceError) {
        expect(result.message).toContain('Error al buscar roles');
      }
    });
  });

  describe('createRole', () => {
    it('should successfully create a new role', async () => {
      const newRole: Omit<Role, 'id'> = {
        name: 'Editor',
        is_active: true,
        accesses: [{ id: 1, name: 'content' }]
      };

      const mockResponse: Role = {
        id: 2,
        ...newRole
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await roleService.createRole(newRole);
      
      expect(api.post).toHaveBeenCalledWith('/roles', {
        name: newRole.name,
        is_active: newRole.is_active,
        accesses: newRole.accesses,
        accesses_ids: [1]
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating a role', async () => {
      const error = new Error('Network error');
      (api.post as jest.Mock).mockRejectedValueOnce(error);

      const newRole: Omit<Role, 'id'> = {
        name: 'Editor',
        is_active: true,
        accesses: [{ id: 1, name: 'content' }]
      };

      const result = await roleService.createRole(newRole);
      
      expect(result).toBeInstanceOf(RoleServiceError);
      if (result instanceof RoleServiceError) {
        expect(result.message).toContain('Error al crear el rol');
      }
    });
  });

  describe('updateRole', () => { 
    it('should successfully update an existing role', async () => {
      const roleId = 1;
      const updatedRole: Omit<Role, 'id'> = {
        name: 'Updated Editor',
        is_active: true,
        accesses: [{ id: 1, name: 'content' }]
      };

      const mockResponse: Role = {
        id: roleId,
        ...updatedRole
      };

      (api.put as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await roleService.updateRole(roleId, updatedRole);
      
      expect(api.put).toHaveBeenCalledWith(`/roles/${roleId}`, {
        name: updatedRole.name,
        is_active: updatedRole.is_active,
        accesses: updatedRole.accesses,
        accesses_ids: [1]
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating a role', async () => {
      const error = new Error('Network error');
      (api.put as jest.Mock).mockRejectedValueOnce(error);

      const roleId = 1;
      const updatedRole: Omit<Role, 'id'> = {
        name: 'Updated Editor',
        is_active: true,
        accesses: [{ id: 1, name: 'content' }]
      };

      const result = await roleService.updateRole(roleId, updatedRole);
      
      expect(result).toBeInstanceOf(RoleServiceError);
      if (result instanceof RoleServiceError) {
        expect(result.message).toContain('Error al actualizar el rol');
      }
    });
  });
}); 