const fs = require('fs');

// 1. Update auth.middleware.ts
const authMidPath = 'packages/backend/src/middleware/auth.middleware.ts';
let authMid = fs.readFileSync(authMidPath, 'utf8');
if (!authMid.includes('requireRole')) {
  authMid += `\n
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim. Kullanıcı bulunamadı.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: \`Bu işlem için yetkiniz yok. Gerekli rol: \${roles.join(',')}\` });
    }
    next();
  };
};
`;
  fs.writeFileSync(authMidPath, authMid);
}

// 2. Update alarms.routes.ts
const alarmsRoutesPath = 'packages/backend/src/routes/alarms.routes.ts';
let alarmsRoutes = fs.readFileSync(alarmsRoutesPath, 'utf8');
if (!alarmsRoutes.includes('requireRole')) {
  alarmsRoutes = alarmsRoutes.replace(
    "import { requireAuth } from '../middleware/auth.middleware';",
    "import { requireAuth, requireRole } from '../middleware/auth.middleware';"
  );
  
  alarmsRoutes = alarmsRoutes.replace(
    "router.patch('/:id/acknowledge', requireAuth, acknowledgeAlarm);",
    "router.patch('/:id/acknowledge', requireAuth, requireRole(['NOC']), acknowledgeAlarm);"
  );
  alarmsRoutes = alarmsRoutes.replace(
    "router.patch('/:id/assign', requireAuth, assignAlarm);",
    "router.patch('/:id/assign', requireAuth, requireRole(['NOC']), assignAlarm);"
  );
  alarmsRoutes = alarmsRoutes.replace(
    "router.patch('/:id/resolve', requireAuth, resolveAlarm);",
    "router.patch('/:id/resolve', requireAuth, requireRole(['NOC', 'FIELD_ENGINEER']), resolveAlarm);"
  );

  fs.writeFileSync(alarmsRoutesPath, alarmsRoutes);
}

console.log("RBAC roles applied.");
