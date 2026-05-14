const fs = require('fs');
const path = require('path');

// 1. Auth Register Add
const authCtrlPath = 'packages/backend/src/controllers/auth.controller.ts';
let authCtrl = fs.readFileSync(authCtrlPath, 'utf8');
if(!authCtrl.includes('export const register = ')){
  authCtrl += `
import { users } from '../db/schema';
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({ email, passwordHash: hashedPassword, role: role || 'NOC' }).returning();
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: newUser[0].id, role: newUser[0].role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '12h' });
    res.status(201).json({ success: true, token, data: newUser[0] });
  } catch (error) { res.status(500).json({ success: false }); }
};
`;
  fs.writeFileSync(authCtrlPath, authCtrl);
}

const authRoutesPath = 'packages/backend/src/routes/auth.routes.ts';
let authRoutes = fs.readFileSync(authRoutesPath, 'utf8');
if(!authRoutes.includes('register')){
  authRoutes = authRoutes.replace('import { login } from', "import { login, register } from");
  authRoutes += `\nrouter.post('/register', register);\n`;
  fs.writeFileSync(authRoutesPath, authRoutes);
}

// 2. Alarms additions
const alarmsCtrlPath = 'packages/backend/src/controllers/alarms.controller.ts';
let alarmsCtrl = fs.readFileSync(alarmsCtrlPath, 'utf8');
if(!alarmsCtrl.includes('export const acknowledgeAlarm = ')){
  alarmsCtrl += `
// PATCH /api/v1/alarms/:id/acknowledge
export const acknowledgeAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms).set({ status: 'ACKNOWLEDGED' }).where(eq(alarms.id, req.params.id as string)).returning();
    res.json({ success: true, data: updated[0] });
  } catch(e) { res.status(500).json({ success: false }); }
};

// PATCH /api/v1/alarms/:id/assign
export const assignAlarm = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await db.update(alarms).set({ status: 'IN_PROGRESS', assignedTo: req.body.assigned_to }).where(eq(alarms.id, req.params.id as string)).returning();
    res.json({ success: true, data: updated[0] });
  } catch(e) { res.status(500).json({ success: false }); }
};

// GET /api/v1/alarms (filtreleme dahil)
export const getAllAlarmsFiltered = async (req: AuthRequest, res: Response) => {
  const { severity, status, station } = req.query;
  // Basit implementation (gerçekte Drizzle 'and', 'eq' conditionları dynamic eklenebilir)
  const all = await db.query.alarms.findMany({
    with: { station: true }
  });
  // In-memory filter for speed
  const filtered = all.filter(a => {
    let match = true;
    if(severity && a.severity !== severity) match = false;
    if(status && a.status !== status) match = false;
    if(station && a.stationId !== station) match = false;
    return match;
  });
  res.json({ success: true, data: filtered });
};
`;
  fs.writeFileSync(alarmsCtrlPath, alarmsCtrl);
}

const alarmsRoutesPath = 'packages/backend/src/routes/alarms.routes.ts';
let alarmsRoutes = fs.readFileSync(alarmsRoutesPath, 'utf8');
if(!alarmsRoutes.includes('acknowledge')){
  alarmsRoutes = alarmsRoutes.replace("import { resolveAlarm } from '../controllers/alarms.controller';", "import { resolveAlarm, acknowledgeAlarm, assignAlarm, getAllAlarmsFiltered } from '../controllers/alarms.controller';");
  alarmsRoutes += `
router.get('/', getAllAlarmsFiltered);
router.patch('/:id/acknowledge', requireAuth, acknowledgeAlarm);
router.patch('/:id/assign', requireAuth, assignAlarm);
router.patch('/:id/resolve', requireAuth, resolveAlarm); // For compatibility with :id
`;
  fs.writeFileSync(alarmsRoutesPath, alarmsRoutes);
}

// 3. Simulator Inject-Anomaly path map
const simRoutesPath = 'packages/backend/src/routes/simulator.routes.ts';
let simRoutes = fs.readFileSync(simRoutesPath, 'utf8');
if(simRoutes.includes("router.post('/inject', injectAnomaly);")) {
  simRoutes = simRoutes.replace("router.post('/inject', injectAnomaly);", "router.post('/inject', injectAnomaly);\nrouter.post('/inject-anomaly', injectAnomaly);");
  fs.writeFileSync(simRoutesPath, simRoutes);
}

console.log("Script executed.");
