import { pgTable, uuid, varchar, timestamp, boolean, integer, decimal, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// TENANTS (Multi-tenancy)
// ============================================
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// USUARIOS Y AUTENTICACIÓN
// ============================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // admin, hr, employee
  active: boolean('active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// EMPLEADOS
// ============================================
export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  employeeCode: varchar('employee_code', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  birthDate: date('birth_date'),
  hireDate: date('hire_date').notNull(),
  terminationDate: date('termination_date'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// DEPARTAMENTOS
// ============================================
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// CARGOS / PUESTOS
// ============================================
export const positions = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  title: varchar('title', { length: 150 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  description: varchar('description', { length: 500 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// FUNCIONES DE PUESTO
// ============================================
export const positionFunctions = pgTable('position_functions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  positionId: uuid('position_id').references(() => positions.id).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: varchar('description', { length: 500 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// ASIGNACIÓN EMPLEADO - PUESTO
// ============================================
export const employeePositions = pgTable('employee_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  positionId: uuid('position_id').references(() => positions.id).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  isCurrent: boolean('is_current').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// CONCEPTOS DE NÓMINA
// ============================================
export const payrollConcepts = pgTable('payroll_concepts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // earning, deduction
  calculationType: varchar('calculation_type', { length: 30 }).notNull(), // fixed, percentage, formula
  value: decimal('value', { precision: 12, scale: 4 }),
  formula: varchar('formula', { length: 500 }),
  appliesToXIII: boolean('applies_to_xiii').default(false).notNull(),
  appliesToVacation: boolean('applies_to_vacation').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// SALARIOS DE EMPLEADOS
// ============================================
export const salaries = pgTable('salaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentFrequency: varchar('payment_frequency', { length: 20 }).notNull(), // weekly, biweekly, monthly
  currency: varchar('currency', { length: 3 }).default('PAB').notNull(),
  effectiveDate: date('effective_date').notNull(),
  endDate: date('end_date'),
  isCurrent: boolean('is_current').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// PRÉSTAMOS DE EMPLEADOS
// ============================================
export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  remainingBalance: decimal('remaining_balance', { precision: 12, scale: 2 }).notNull(),
  installmentAmount: decimal('installment_amount', { precision: 12, scale: 2 }).notNull(),
  totalInstallments: integer('total_installments').notNull(),
  paidInstallments: integer('paid_installments').default(0).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, paid, cancelled
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// PLANILLAS / PAYROLL RUNS
// ============================================
export const payrolls = pgTable('payrolls', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  paymentDate: date('payment_date').notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, processing, completed, cancelled
  totalEmployees: integer('total_employees').default(0).notNull(),
  totalGross: decimal('total_gross', { precision: 15, scale: 2 }).default('0').notNull(),
  totalDeductions: decimal('total_deductions', { precision: 15, scale: 2 }).default('0').notNull(),
  totalNet: decimal('total_net', { precision: 15, scale: 2 }).default('0').notNull(),
  includesXIII: boolean('includes_xiii').default(false).notNull(),
  includesVacation: boolean('includes_vacation').default(false).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// ============================================
// DETALLES DE PLANILLA POR EMPLEADO
// ============================================
export const payrollDetails = pgTable('payroll_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  payrollId: uuid('payroll_id').references(() => payrolls.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  grossSalary: decimal('gross_salary', { precision: 12, scale: 2 }).notNull(),
  totalEarnings: decimal('total_earnings', { precision: 12, scale: 2 }).default('0').notNull(),
  totalDeductions: decimal('total_deductions', { precision: 12, scale: 2 }).default('0').notNull(),
  netSalary: decimal('net_salary', { precision: 12, scale: 2 }).notNull(),
  daysWorked: decimal('days_worked', { precision: 5, scale: 2 }).default('0').notNull(),
  vacationDays: decimal('vacation_days', { precision: 5, scale: 2 }).default('0').notNull(),
  xiiiDays: decimal('xiii_days', { precision: 5, scale: 2 }).default('0').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, processed, paid
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// MOVIMIENTOS DE CONCEPTOS EN PLANILLA
// ============================================
export const payrollConceptMovements = pgTable('payroll_concept_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  payrollDetailId: uuid('payroll_detail_id').references(() => payrollDetails.id).notNull(),
  conceptId: uuid('concept_id').references(() => payrollConcepts.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // earning, deduction
  description: varchar('description', { length: 300 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// VACACIONES
// ============================================
export const vacations = pgTable('vacations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  year: integer('year').notNull(),
  totalDays: decimal('total_days', { precision: 5, scale: 2 }).notNull(),
  usedDays: decimal('used_days', { precision: 5, scale: 2 }).default('0').notNull(),
  availableDays: decimal('available_days', { precision: 5, scale: 2 }).notNull(),
  accruedDays: decimal('accrued_days', { precision: 5, scale: 2 }).default('0').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, in_progress, completed, cancelled
  requestedAt: timestamp('requested_at'),
  approvedAt: timestamp('approved_at'),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// ASISTENCIA / MARCAJES
// ============================================
export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  employeeId: uuid('employee_id').references(() => employees.id).notNull(),
  date: date('date').notNull(),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  status: varchar('status', { length: 20 }).default('present').notNull(), // present, absent, late, half_day, vacation, sick
  notes: varchar('notes', { length: 500 }),
  source: varchar('source', { length: 50 }).default('manual').notNull(), // manual, webhook, api
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// WEBHOOKS CONFIGURACIÓN
// ============================================
export const webhooks = pgTable('webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  events: varchar('events', { length: 200 }).notNull(), // JSON array of event types
  secret: varchar('secret', { length: 255 }).notNull(),
  active: boolean('active').default(true).notNull(),
  lastTriggeredAt: timestamp('last_triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// AUDIT LOG
// ============================================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entity: varchar('entity', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// RELACIONES
// ============================================
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  employees: many(employees),
  departments: many(departments),
  positions: many(positions),
  payrollConcepts: many(payrollConcepts),
  salaries: many(salaries),
  loans: many(loans),
  payrolls: many(payrolls),
  payrollDetails: many(payrollDetails),
  payrollConceptMovements: many(payrollConceptMovements),
  vacations: many(vacations),
  attendance: many(attendance),
  webhooks: many(webhooks),
  auditLogs: many(auditLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  sessions: many(sessions),
  employees: many(employees),
  createdPayrolls: many(payrolls),
  approvedVacations: many(vacations),
  auditLogs: many(auditLogs),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [employees.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  positions: many(employeePositions),
  salaries: many(salaries),
  loans: many(loans),
  payrollDetails: many(payrollDetails),
  vacations: many(vacations),
  attendance: many(attendance),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [departments.tenantId],
    references: [tenants.id],
  }),
  positions: many(positions),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [positions.tenantId],
    references: [tenants.id],
  }),
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
  functions: many(positionFunctions),
  employeePositions: many(employeePositions),
}));

export const payrollsRelations = relations(payrolls, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [payrolls.tenantId],
    references: [tenants.id],
  }),
  creator: one(users, {
    fields: [payrolls.createdBy],
    references: [users.id],
  }),
  details: many(payrollDetails),
}));

export const payrollDetailsRelations = relations(payrollDetails, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [payrollDetails.tenantId],
    references: [tenants.id],
  }),
  payroll: one(payrolls, {
    fields: [payrollDetails.payrollId],
    references: [payrolls.id],
  }),
  employee: one(employees, {
    fields: [payrollDetails.employeeId],
    references: [employees.id],
  }),
  conceptMovements: many(payrollConceptMovements),
}));

export const payrollConceptsRelations = relations(payrollConcepts, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [payrollConcepts.tenantId],
    references: [tenants.id],
  }),
  movements: many(payrollConceptMovements),
}));

export const payrollConceptMovementsRelations = relations(payrollConceptMovements, ({ one }) => ({
  tenant: one(tenants, {
    fields: [payrollConceptMovements.tenantId],
    references: [tenants.id],
  }),
  payrollDetail: one(payrollDetails, {
    fields: [payrollConceptMovements.payrollDetailId],
    references: [payrollDetails.id],
  }),
  concept: one(payrollConcepts, {
    fields: [payrollConceptMovements.conceptId],
    references: [payrollConcepts.id],
  }),
}));
