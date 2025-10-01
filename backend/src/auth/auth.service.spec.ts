import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

// Mock PrismaService to avoid ESM issues
const mockPrismaService = {
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  usuarioRol: {
    findMany: jest.fn(),
  },
  trazaGeneral: {
    create: jest.fn(),
  },
};

// Mock the PrismaService import
jest.mock('../prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'PrismaService',
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ldapLogout', () => {
    it('should logout successfully', async () => {
      mockPrismaService.trazaGeneral.create.mockResolvedValue({});

      const result = await service.ldapLogout('user-id-123', '192.168.1.1');

      expect(result).toEqual({
        success: true,
        message: 'Logout exitoso',
      });

      expect(mockPrismaService.trazaGeneral.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          actorId: 'user-id-123',
          rol: 'SISTEMA',
          accion: 'LOGOUT_LDAP',
          entidad: 'AUTH',
          entidadId: 'user-id-123',
          descripcion: 'Logout desde IP: 192.168.1.1',
        }),
      });
    });

    it('should handle logout errors gracefully', async () => {
      mockPrismaService.trazaGeneral.create.mockRejectedValue(new Error('Database error'));

      await expect(service.ldapLogout('user-id-123', '192.168.1.1'))
        .rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockRoles = [
        { rol: 'ADMINISTRADOR' },
        { rol: 'RESPONSABLE_LOCAL' },
      ];

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuarioRol.findMany.mockResolvedValue(mockRoles);

      const result = await service.getProfile('user-id-123');

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['ADMINISTRADOR', 'RESPONSABLE_LOCAL'],
        sede: null,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('invalid-user-id'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateJwtPayload', () => {
    it('should validate JWT payload successfully', async () => {
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const payload = {
        id: 'user-id-123',
        email: 'test@example.com',
        roles: ['ADMINISTRADOR'],
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateJwtPayload(payload);

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['ADMINISTRADOR'],
        sede: null,
      });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const payload = {
        id: 'invalid-user-id',
        email: 'test@example.com',
        roles: ['ADMINISTRADOR'],
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.validateJwtPayload(payload))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserRoles', () => {
    it('should return user roles', async () => {
      const mockUserRoles = [
        { rol: 'ADMINISTRADOR' },
        { rol: 'RESPONSABLE_LOCAL' },
      ];

      mockPrismaService.usuarioRol.findMany.mockResolvedValue(mockUserRoles);

      // Usar método público para testing
      const result = await (service as any).getUserRoles('user-id-123');

      expect(result).toEqual(['ADMINISTRADOR', 'RESPONSABLE_LOCAL']);
      expect(mockPrismaService.usuarioRol.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 'user-id-123' },
        select: { rol: true },
      });
    });
  });
});