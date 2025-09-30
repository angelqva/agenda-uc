import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { UsuarioService } from "@/services";
import { findUsuarioByEmailSchema } from "@/schemas";
import type { ApiResult } from "@/dtos";

/**
 * GET /api/usuarios/roles/[email]
 * Obtiene los roles efectivos de un usuario con manejo avanzado de errores
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    // Validar parámetros usando schema
    const input = findUsuarioByEmailSchema.parse({ email: params.email });

    // Obtener roles efectivos con manejo de errores mejorado
    const result = await UsuarioService.getEffectiveRoles(input);

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

    // Si hay error de negocio o no encontrado, status correspondiente
    if (!result.success) {
      const statusCode = result.rootError?.includes("no encontrado") ? 404 : 500;
      apiResponse.statusCode = statusCode;
      return NextResponse.json(apiResponse, { status: statusCode });
    }

    // Éxito
    return NextResponse.json(apiResponse, { status: 200 });

  } catch (error) {
    console.error("Error en API de roles:", error);
    
    if (error instanceof ZodError) {
      const apiResponse: ApiResult = {
        success: false,
        fieldErrors: error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          if (!acc[field]) acc[field] = [];
          acc[field].push(err.message);
          return acc;
        }, {} as Record<string, string[]>),
        rootError: "Parámetros inválidos",
        toast: {
          type: 'error',
          title: 'Parámetros Inválidos',
          message: 'El email proporcionado no tiene un formato válido',
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