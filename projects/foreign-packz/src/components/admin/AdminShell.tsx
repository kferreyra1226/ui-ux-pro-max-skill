'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useAdminSession } from '@/context/AdminSessionContext';
import { LEGAL } from '@/lib/config';
import { cx, isRoute } from '@/lib/format';
import { ROLE_LABELS } from '@/lib/mock/staff';
import type { Permission, StaffRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  permission: Permission;
  group: 'Operations' | 'Catalog' | 'Business' | 'Administration';
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', permission: 'orders.view', group: 'Operations' },
  { href: '/admin/orders', label: 'Order Requests', permission: 'orders.view', group: 'Operations' },
  { href: '/admin/deliveries', label: 'Delivery Requests', permission: 'delivery.manage', group: 'Operations' },
  { href: '/admin/hours', label: 'Hours & Availability', permission: 'schedule.manage', group: 'Operations' },
  { href: '/admin/inventory', label: 'Inventory', permission: 'inventory.view', group: 'Catalog' },
  { href: '/admin/products', label: 'Products', permission: 'products.edit', group: 'Catalog' },
  { href: '/admin/categories', label: 'Categories', permission: 'products.edit', group: 'Catalog' },
  { href: '/admin/apparel', label: 'Apparel', permission: 'products.edit', group: 'Catalog' },
  { href: '/admin/media', label: 'Media Library', permission: 'media.manage', group: 'Catalog' },
  { href: '/admin/customers', label: 'Customers', permission: 'customers.view', group: 'Business' },
  { href: '/admin/zones', label: 'Delivery Zones', permission: 'delivery.manage', group: 'Business' },
  { href: '/admin/promotions', label: 'Promotions', permission: 'products.edit', group: 'Business' },
  { href: '/admin/content', label: 'Content', permission: 'content.edit', group: 'Business' },
  { href: '/admin/reports', label: 'Reports', permission: 'reports.view', group: 'Business' },
  { href: '/admin/staff', label: 'Staff & Permissions', permission: 'staff.manage', group: 'Administration' },
  { href: '/admin/audit', label: 'Audit Logs', permission: 'audit.view', group: 'Administration' },
  { href: '/admin/settings', label: 'Settings', permission: 'settings.manage', group: 'Administration' },
];

const GROUPS: NavItem['group'][] = ['Operations', 'Catalog', 'Business', 'Administration'];

const MOBILE_TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/deliveries', label: 'Delivery' },
  { href: '/admin/inventory', label: 'Inventory' },
];

/** Desktop side navigation plus a mobile bottom tab bar and a slide-over menu. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role, previewAs, signOut, can } = useAdminSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const allowed = NAV.filter((item) => can(item.permission));

  return (
    <div className="min-h-[100dvh] bg-ink">
      <div className="lg:flex">
        {/* ------------------------------------------------- desktop side nav */}
        <aside className="hidden w-64 shrink-0 border-r border-ink-line bg-ink-soft lg:block">
          <div className="sticky top-0 flex h-[100dvh] flex-col overflow-y-auto p-5">
            <Link href="/admin" className="font-display text-lg tracking-[0.04em] text-bone">
              FOREIGN PACKZ
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-chrome-dim">Owner dashboard</p>

            <nav aria-label="Admin" className="mt-7 flex-1 space-y-6">
              {GROUPS.map((group) => {
                const items = allowed.filter((i) => i.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-chrome-dim">{group}</p>
                    <ul className="space-y-0.5">
                      {items.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
                    </ul>
                  </div>
                );
              })}
            </nav>

            <RolePreview role={role} onChange={previewAs} />

            <Link
              href="/admin/login"
              onClick={signOut}
              className="mt-4 block rounded-sm border border-ink-line px-3 py-2.5 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-chrome transition-colors hover:border-danger/50 hover:text-danger"
            >
              Logout
            </Link>
          </div>
        </aside>

        {/* ------------------------------------------------------------ content */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-ink-line bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
            <Link href="/admin" className="font-display text-base tracking-[0.04em] text-bone">
              FP ADMIN
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="min-h-[44px] rounded-sm border border-ink-line px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-chrome"
              aria-expanded={menuOpen}
            >
              Menu
            </button>
          </div>

          {/* Persistent compliance notice - present on every admin screen by design.
              On a phone it collapses to one line so it never buries the screen, but it is
              always visible and always one tap from the full text. */}
          <div className="border-b border-warn/30 bg-warn/10 px-4 py-3 lg:px-8">
            <details className="group lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-bold uppercase tracking-[0.12em] text-warn">
                Compliance notice
                <span aria-hidden="true" className="shrink-0 text-[11px] font-normal normal-case tracking-normal transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-warn">{LEGAL.adminComplianceNotice}</p>
            </details>
            <p className="hidden text-[12px] leading-relaxed text-warn lg:block">
              <span className="font-bold uppercase tracking-[0.12em]">Compliance notice &mdash; </span>
              {LEGAL.adminComplianceNotice}
            </p>
          </div>

          <div className="px-4 pb-[calc(72px+env(safe-area-inset-bottom,0px))] pt-6 lg:px-8 lg:pb-12 lg:pt-8">
            {children}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- mobile slide-over */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 flex h-[100dvh] w-[85%] max-w-xs flex-col overflow-y-auto border-l border-ink-line bg-ink-soft p-5 animate-slide-in">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg text-bone">Menu</p>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-sm text-chrome">
                <span aria-hidden="true" className="text-lg">&times;</span>
              </button>
            </div>
            <nav aria-label="Admin mobile" className="flex-1 space-y-5">
              {GROUPS.map((group) => {
                const items = allowed.filter((i) => i.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-chrome-dim">{group}</p>
                    <ul className="space-y-0.5">
                      {items.map((item) => (
                        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>
            <RolePreview role={role} onChange={previewAs} />
            <Link
              href="/admin/login"
              onClick={signOut}
              className="mt-4 block rounded-sm border border-ink-line px-3 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-chrome"
            >
              Logout
            </Link>
          </div>
        </div>
      ) : null}

      {/* -------------------------------------------------- mobile bottom tabs */}
      <nav
        aria-label="Admin quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-ink/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="grid grid-cols-4">
          {MOBILE_TABS.map((tab) => {
            const active = tab.href === '/admin'
              ? isRoute(pathname, '/admin')
              : pathname.startsWith(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'flex min-h-[60px] items-center justify-center px-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em]',
                    active ? 'text-bone' : 'text-chrome-dim',
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function NavLink({
  item, pathname, onNavigate,
}: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = item.href === '/admin'
    ? isRoute(pathname, '/admin')
    : pathname.startsWith(item.href);
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cx(
          'block rounded-sm px-3 py-2.5 text-[13px] font-medium transition-colors',
          active ? 'bg-bone text-ink' : 'text-chrome hover:bg-bone/5 hover:text-bone',
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

/** Prototype-only role preview. This is not a credential and grants nothing server-side. */
function RolePreview({ role, onChange }: { role: StaffRole; onChange: (r: StaffRole) => void }) {
  return (
    <div className="mt-6 rounded-sm border border-ink-line bg-ink p-3">
      <label htmlFor="fp-role-preview" className="block text-[10px] font-bold uppercase tracking-[0.16em] text-chrome-dim">
        Preview as role
      </label>
      <select
        id="fp-role-preview"
        value={role}
        onChange={(e) => onChange(e.target.value as StaffRole)}
        className="mt-2 min-h-[44px] w-full rounded-sm border border-ink-line bg-ink-soft px-3 text-[13px] text-bone"
      >
        {(Object.keys(ROLE_LABELS) as StaffRole[]).map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      <p className="mt-2 text-[11px] leading-snug text-chrome-dim">
        Prototype control. It changes which screens this preview shows and grants no access.
      </p>
    </div>
  );
}
