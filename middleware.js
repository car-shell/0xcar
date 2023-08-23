import { NextResponse } from "next/server";
import isMobile from "is-mobile";

export function middleware(request) {
  const response = NextResponse.next();
  const url = request.nextUrl.clone();
  const ua = request.headers.get("user-agent") || "";
  const isMobileDevice = isMobile({ ua, tablet: false });
//   const isTabletDevice = !isMobileDevice && isMobile({ ua, tablet: true });
  console.log("--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
  if (isMobileDevice && !url.pathname.startsWith("/mobile")) {
      url.pathname = "/mobile";
    return NextResponse.redirect(url);
  } 
  return response;
}

export const config = {
  matcher: ["/", "/mobile"],
};
