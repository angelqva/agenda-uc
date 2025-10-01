import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { LoginDto, JwtPayload, RefreshTokenPayload } from './auth.dto';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

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

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const refreshTokenPayload = {
        sub: 'user-id-123',
        type: 'refresh',
        tokenId: 'token-id-123',
      };

      const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
        refreshToken: 'valid-refresh-token',
        activo: true,
        roles: [
          { rol: 'USUARIO' },
        ],
      };

      // Mock getUserRoles method
      jest.spyOn(service as any, 'getUserRoles').mockResolvedValue(['USUARIO']);

      mockJwtService.verify.mockReturnValue(refreshTokenPayload);
      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuario.update.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token') // for access token
        .mockResolvedValueOnce('new-refresh-token'); // for refresh token

      const result = await service.refreshAccessToken('valid-refresh-token', mockResponse);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Token renovado exitosamente');
      expect(mockJwtService.verify).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshAccessToken('invalid-token', mockResponse)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const refreshTokenPayload = {
        sub: 'non-existent-user',
        type: 'refresh',
        tokenId: 'token-id-123',
      };

      mockJwtService.verify.mockReturnValue(refreshTokenPayload);
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.refreshAccessToken('valid-token', mockResponse)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('ldapLogout', () => {
    it('should logout successfully', async () => {
      mockPrismaService.trazaGeneral.create.mockResolvedValue({});

      const result = await service.ldapLogout('user-id-123', mockResponse, '192.168.1.1');

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
        }),
      });
    });

    it('should handle logout errors gracefully', async () => {
      // Mock para que createAuthTrace falle
      jest.spyOn(service as any, 'createAuthTrace').mockRejectedValue(new Error('Database error'));

      await expect(
        service.ldapLogout('user-id-123', mockResponse, '192.168.1.1')
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockUserRoles = [
        { rol: 'USUARIO' },
        { rol: 'ADMINISTRADOR' },
      ];

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuarioRol.findMany.mockResolvedValue(mockUserRoles);

      const result = await service.getProfile('user-id-123');

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['USUARIO', 'ADMINISTRADOR'],
      });

      expect(mockPrismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-123' },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('invalid-user-id'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle database errors gracefully', async () => {
      mockPrismaService.usuario.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.getProfile('user-id-123'))
        .rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateJwtPayload', () => {
    it('should validate JWT payload successfully', async () => {
      const mockUser = {
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        activo: true,
      };

      const payload: JwtPayload = {
        sub: 'user-id-123',
        email: 'test@example.com',
        roles: ['USUARIO'],
        type: 'access',
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateJwtPayload(payload);

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['USUARIO'],
      });

      expect(mockPrismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-123' },
      });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      const payload: JwtPayload = {
        sub: 'invalid-user-id',
        email: 'test@example.com',
        roles: ['USUARIO'],
        type: 'access',
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.validateJwtPayload(payload))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});