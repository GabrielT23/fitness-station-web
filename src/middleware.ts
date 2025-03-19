import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const userType = req.cookies.get("user_type")?.value;
  const { pathname } = req.nextUrl;

  // Se o usuário NÃO estiver autenticado e tentar acessar uma página protegida
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se o usuário ESTIVER autenticado e tentar acessar a página de login, redireciona para o dashboard
  if (token && userType === "client" && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && userType === "client" && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  if (token && userType === "admin" && pathname === "/login") {
    return NextResponse.redirect(new URL("/users", req.url));
  }


  return NextResponse.next();
}

// Aplicar o middleware para todas as páginas, exceto assets estáticos e API pública
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

