const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

export default {
  // Permite abrir la app desde el celular en la misma red wifi durante el desarrollo.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
