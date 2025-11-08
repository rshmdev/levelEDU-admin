// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  timeout: 30000,
  retries: 3,
} as const;

// User Roles and Permissions (Padronizado com API)
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin', 
  TEACHER: 'teacher',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Permission mapping for role-based access control
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    'manage_all_tenants',
    'view_all_analytics',
    'manage_billing',
    'manage_subscriptions',
    'access_admin_panel',
  ],
  [USER_ROLES.TENANT_ADMIN]: [
    'manage_tenant_users',
    'view_tenant_analytics',
    'manage_tenant_settings',
    'access_tenant_dashboard',
    'manage_classes',
    'manage_students',
    'manage_missions',
    'manage_products',
  ],
  [USER_ROLES.TEACHER]: [
    'view_students',
    'manage_classes',
    'assign_missions',
    'give_rewards',
    'access_tenant_dashboard',
  ],
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/admin/auth/login',
    logout: '/admin/auth/logout',
    refresh: '/admin/auth/refresh',
  },

  // Admin Users (for tenant admins and teachers)
  adminUsers: {
    list: '/admin/users',
    create: '/admin/users/register',
    update: '/admin/users',
    delete: '/admin/users',
  },

  // Students
  students: {
    list: '/admin/students',
    create: '/admin/students',
    update: '/admin/students',
    delete: '/admin/students',
    ranking: '/admin/students/ranking',
  },

  // Classes
  classes: {
    list: '/admin/classes',
    create: '/admin/classes',
    update: '/admin/classes',
    delete: '/admin/classes',
  },

  // Missions/Attitudes
  missions: {
    list: '/admin/missions',
    create: '/admin/missions',
    update: '/admin/missions',
    delete: '/admin/missions',
    assignments: '/admin/missions/assignments',
  },

  // Products
  products: {
    list: '/admin/products',
    create: '/admin/products',
    update: '/admin/products',
    delete: '/admin/products',
  },

  // Sales/Purchases
  sales: {
    list: '/admin/purchases',
    create: '/admin/purchases',
    update: '/admin/purchases',
    delete: '/admin/purchases',
  },

  // Analytics/Home
  analytics: {
    home: '/admin/home',
  },

  // Tenants (for super admin)
  tenants: {
    list: '/admin/tenants',
    create: '/admin/tenants',
    update: '/admin/tenants',
    delete: '/admin/tenants',
  },

  // Billing (for super admin)
  billing: {
    subscriptions: '/admin/subscriptions',
    webhooks: '/admin/webhooks',
  },
} as const;

// Session settings (simplificado)
export const SECURITY_CONFIG = {
  session: {
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // 1 day in seconds
  },
} as const;

// Tenant Configuration (simplificado)
export const TENANT_CONFIG = {
  reservedSubdomains: [
    'www', 'admin', 'api', 'app', 'login', 'register', 'dashboard'
  ] as string[],
  subdomainPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
  minLength: 3,
  maxLength: 30,
} as const;

// Helper functions (simplificado)
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain) return false;
  if (subdomain.length < TENANT_CONFIG.minLength || subdomain.length > TENANT_CONFIG.maxLength) return false;
  if (TENANT_CONFIG.reservedSubdomains.includes(subdomain.toLowerCase())) return false;
  return TENANT_CONFIG.subdomainPattern.test(subdomain.toLowerCase());
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] as readonly string[];
  return permissions?.includes(permission) || false;
}

export function canAccessTenant(userRole: UserRole, requestedTenant?: string): boolean {
  // Super admins can access any tenant
  if (userRole === USER_ROLES.SUPER_ADMIN) return true;

  // Other users can only access their own tenant (this should be validated server-side)
  const nonSuperAdminRoles = [USER_ROLES.TENANT_ADMIN, USER_ROLES.TEACHER];
  return nonSuperAdminRoles.includes(userRole) && Boolean(requestedTenant);
}