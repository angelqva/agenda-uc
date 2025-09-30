import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { UsuarioService } from "@/services";
import { verifyRoleSchema } from "@/schemas";
import type { ApiResult } from "@/dtos";

/**
 * POST /api/usuarios/verify-role
 * Verifica si un usuario tiene un rol específico con manejo avanzado de errores
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada usando schema
    const input = verifyRoleSchema.parse(body);

    // Verificar rol con manejo de errores mejorado
    const result = await UsuarioService.hasRole(input);

    // Convertir ServiceResult a ApiResult
    const apiResponse: ApiResult = {
      ...result,
      statusCode: result.success ? 200 : 400,
      path: request.url,
      requestId: crypto.randomUUID(),
    };

    // Si hay errores de validación de campos, status 400
    if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
      return NextResponse.json(apiResponse, { status: 400 });
    }

    // Si hay error de negocio, status correspondiente
    if (!result.success) {
      const statusCode = result.rootError?.includes("no encontrado") ? 404 : 500;
      apiResponse.statusCode = statusCode;
      return NextResponse.json(apiResponse, { status: statusCode });
    }

    // Éxito
    return NextResponse.json(apiResponse, { status: 200 });

  } catch (error) {
    console.error("Error en API de verificación de rol:", error);
    
    if (error instanceof ZodError) {
      const apiResponse: ApiResult = {
        success: false,
        fieldErrors: error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          if (!acc[field]) acc[field] = [];
          acc[field].push(err.message);
          return acc;
        }, {} as Record<string, string[]>),
        rootError: "Datos de entrada inválidos",
        toast: {
          type: 'error',
          title: 'Datos Inválidos',
          message: 'Por favor, revisa los campos marcados',
        },
        statusCode: 400,
        path: request.url,
        requestId: crypto.randomUUID(),
      };
      return NextResponse.json(apiResponse, { status: 400 });
    }
    
    const apiResponse: ApiResult = {
      success: false,
      rootError: "Error interno del servidor",
      toast: {
        type: 'error',
        title: 'Error del Servidor',
        message: 'Ocurrió un problema interno. Por favor, intenta nuevamente.',
      },
      statusCode: 500,
      path: request.url,
      requestId: crypto.randomUUID(),
    };

    return NextResponse.json(apiResponse, { status: 500 });
  }
}