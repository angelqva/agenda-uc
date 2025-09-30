export async function GET(req: Request) {
    //get token from search params cause i pass by search params
    const url = new URL(req.url);
    const token = url.searchParams.get("token");    
    if (!token) {
        return Response.redirect(process.env.NEXT_PUBLIC_NEXTAUTH_URL!, 302);
    }
    const logoutUrl =
        `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout` +
        `?id_token_hint=${token}` +
        `&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_NEXTAUTH_URL!)}`;

    return Response.redirect(logoutUrl, 302);
}
