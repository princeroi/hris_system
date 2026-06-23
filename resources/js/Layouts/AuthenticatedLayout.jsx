import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

// ── Icons ──────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h4.5a1.125 1.125 0 001.125-1.125V14.25a1.125 1.125 0 011.125-1.125h2.25a1.125 1.125 0 011.125 1.125v5.625A1.125 1.125 0 0016.875 21h4.5a1.125 1.125 0 001.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

const UsersIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
);

const ArchiveIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const BuildingIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

const LayoutGridIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
);

// Sliders icon for Options (replaces cog)
const SlidersIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

const ProfileIcon = () => (
    <svg className="h-[13px] w-[13px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="h-[13px] w-[13px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const HamburgerIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Chevron for collapsible sections
const ChevronIcon = ({ open }) => (
    <svg
        className="h-[11px] w-[11px] shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        style={{ transition: 'transform 0.18s ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

function isActive(routePrefix) {
    try {
        return route().current(`${routePrefix}*`);
    } catch {
        return false;
    }
}

function isAnyActive(prefixes) {
    return prefixes.some(p => isActive(p));
}

// ── Collapsible Nav Group ──────────────────────────────────────────────────────

function CollapsibleNavItem({ label, icon, children, activePrefixes, closeSidebar }) {
    const defaultOpen = isAnyActive(activePrefixes);
    const [open, setOpen] = useState(defaultOpen);
    const anyActive = isAnyActive(activePrefixes);

    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                className={`nav-link nav-collapsible-btn w-full${anyActive ? ' active-parent' : ''}`}
            >
                <span className="nav-icon">{icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                <ChevronIcon open={open} />
            </button>

            <div
                className="nav-sub-list"
                style={{
                    maxHeight: open ? '200px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.22s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <div className="flex flex-col gap-0.5 pt-0.5 pb-0.5" style={{ paddingLeft: 12 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ── Layout ─────────────────────────────────────────────────────────────────────

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeSidebar = () => setSidebarOpen(false);

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap');

                html, body, #app { height: 100%; overflow: hidden; }

                *, *::before, *::after {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    box-sizing: border-box;
                }

                :root {
                    --c-bg:          #F5F6FA;
                    --c-surface:     #FFFFFF;
                    --c-border:      #E8EAF0;
                    --c-border-mid:  #D1D5E4;

                    --c-accent:      #4F46E5;
                    --c-accent-2:    #6366F1;
                    --c-accent-dim:  #EEF2FF;
                    --c-accent-ring: #C7D2FE;

                    --c-text-1:      #111827;
                    --c-text-2:      #4B5563;
                    --c-text-3:      #9CA3AF;

                    --sidebar-w:     220px;
                    --topbar-h:      56px;
                    --radius-sm:     6px;
                    --radius-md:     8px;
                }

                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 6.5px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--c-text-2);
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s;
                    position: relative;
                    letter-spacing: -0.01em;
                    white-space: nowrap;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    width: 100%;
                }
                .nav-link:hover {
                    background: var(--c-bg);
                    color: var(--c-text-1);
                }
                .nav-link.active {
                    background: var(--c-accent-dim);
                    color: var(--c-accent);
                    font-weight: 600;
                }
                .nav-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 5px; bottom: 5px;
                    width: 2.5px;
                    border-radius: 0 2px 2px 0;
                    background: var(--c-accent);
                }
                .nav-link .nav-icon {
                    flex-shrink: 0;
                    opacity: 0.65;
                    transition: opacity 0.12s;
                }
                .nav-link:hover .nav-icon,
                .nav-link.active .nav-icon { opacity: 1; }

                /* Collapsible parent button */
                .nav-collapsible-btn {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 6.5px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--c-text-2);
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s;
                    position: relative;
                    letter-spacing: -0.01em;
                    white-space: nowrap;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                }
                .nav-collapsible-btn:hover {
                    background: var(--c-bg);
                    color: var(--c-text-1);
                }
                .nav-collapsible-btn.active-parent {
                    color: var(--c-accent);
                    font-weight: 600;
                }
                .nav-collapsible-btn .nav-icon {
                    flex-shrink: 0;
                    opacity: 0.65;
                    transition: opacity 0.12s;
                }
                .nav-collapsible-btn:hover .nav-icon,
                .nav-collapsible-btn.active-parent .nav-icon { opacity: 1; }

                /* Sub-items: connector line */
                .nav-sub-list {
                    position: relative;
                }
                .nav-sub-list::before {
                    content: '';
                    position: absolute;
                    left: 20px;
                    top: 4px;
                    bottom: 4px;
                    width: 1px;
                    background: var(--c-border);
                    border-radius: 1px;
                }
                .nav-sub-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 5.5px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 12.5px;
                    font-weight: 500;
                    color: var(--c-text-2);
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s;
                    position: relative;
                    letter-spacing: -0.01em;
                    white-space: nowrap;
                }
                .nav-sub-link:hover {
                    background: var(--c-bg);
                    color: var(--c-text-1);
                }
                .nav-sub-link.active {
                    background: var(--c-accent-dim);
                    color: var(--c-accent);
                    font-weight: 600;
                }
                .nav-sub-link .nav-icon {
                    flex-shrink: 0;
                    opacity: 0.6;
                    transition: opacity 0.12s;
                }
                .nav-sub-link:hover .nav-icon,
                .nav-sub-link.active .nav-icon { opacity: 1; }

                .avatar {
                    background: linear-gradient(140deg, #C7D2FE 0%, #EEF2FF 100%);
                    border: 1px solid var(--c-accent-ring);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 30px;
                    height: 30px;
                }
                .avatar span {
                    font-size: 10.5px;
                    font-weight: 700;
                    color: var(--c-accent);
                    letter-spacing: 0.02em;
                    line-height: 1;
                    user-select: none;
                }

                .foot-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    flex: 1;
                    padding: 5.5px 8px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--c-border);
                    background: transparent;
                    color: var(--c-text-2);
                    font-size: 12px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s, border-color 0.12s;
                    cursor: pointer;
                    letter-spacing: -0.01em;
                }
                .foot-btn:hover {
                    background: var(--c-bg);
                    color: var(--c-text-1);
                    border-color: var(--c-border-mid);
                }
                .foot-btn-danger:hover {
                    background: #FEF2F2;
                    color: #DC2626;
                    border-color: #FECACA;
                }

                .overlay-fade { animation: overlayIn 0.16s ease; }
                @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }

                .nav-group-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--c-text-3);
                    padding: 0 10px;
                    margin-bottom: 3px;
                    display: block;
                }

                .nav-divider {
                    height: 1px;
                    background: var(--c-border);
                    margin: 10px 10px;
                }
            `}</style>

            <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="overlay-fade fixed inset-0 z-20 lg:hidden"
                        style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(3px)' }}
                        onClick={closeSidebar}
                    />
                )}

                {/* ── Sidebar ── */}
                <aside
                    className={[
                        'fixed inset-y-0 left-0 z-30 flex h-full flex-col lg:static lg:h-screen',
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    ].join(' ')}
                    style={{
                        width: 'var(--sidebar-w)',
                        background: 'var(--c-surface)',
                        borderRight: '1px solid var(--c-border)',
                        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    {/* Logo row */}
                    <div
                        className="flex h-[var(--topbar-h)] shrink-0 items-center justify-between px-5"
                        style={{ borderBottom: '1px solid var(--c-border)' }}
                    >
                        <Link href="/" onClick={closeSidebar} className="flex items-center gap-2.5">
                            <ApplicationLogo
                                className="h-6 w-auto fill-current"
                                style={{ color: 'var(--c-accent)' }}
                            />
                        </Link>
                        <button
                            className="lg:hidden rounded-md p-1.5 focus:outline-none"
                            style={{ color: 'var(--c-text-3)', transition: 'background 0.12s, color 0.12s' }}
                            onClick={closeSidebar}
                            aria-label="Close sidebar"
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-bg)'; e.currentTarget.style.color = 'var(--c-text-1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text-3)'; }}
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">

                        {/* ── Main group ── */}
                        <span className="nav-group-label">Main</span>
                        <div className="flex flex-col gap-0.5 mb-1">

                            {/* Dashboard */}
                            <Link
                                href={route('dashboard')}
                                onClick={closeSidebar}
                                className={`nav-link${isActive('dashboard') ? ' active' : ''}`}
                            >
                                <span className="nav-icon"><HomeIcon /></span>
                                <span>Dashboard</span>
                            </Link>

                            {/* Employees — collapsible */}
                            <CollapsibleNavItem
                                label="Employees"
                                icon={<UsersIcon />}
                                activePrefixes={['employees']}
                                closeSidebar={closeSidebar}
                            >
                                <Link
                                    href={route('employees.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('employees.index') || (isActive('employees') && !isActive('employees.archive_employees')) ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><UsersIcon /></span>
                                    <span>Employee List</span>
                                </Link>
                                <Link
                                    href={route('employees.archive_employees.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('employees.archive_employees') ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><ArchiveIcon /></span>
                                    <span>Archived</span>
                                </Link>
                            </CollapsibleNavItem>

                        </div>

                        <div className="nav-divider" />

                        {/* ── Organization group — collapsible ── */}
                        <span className="nav-group-label">Organization</span>
                        <div className="flex flex-col gap-0.5 mb-1">
                            <CollapsibleNavItem
                                label="Organization"
                                icon={<BuildingIcon />}
                                activePrefixes={['companies', 'departments', 'positions']}
                                closeSidebar={closeSidebar}
                            >
                                <Link
                                    href={route('companies.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('companies') ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><BuildingIcon /></span>
                                    <span>Companies</span>
                                </Link>
                                <Link
                                    href={route('departments.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('departments') ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><LayoutGridIcon /></span>
                                    <span>Departments</span>
                                </Link>
                                <Link
                                    href={route('positions.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('positions') ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><BriefcaseIcon /></span>
                                    <span>Positions</span>
                                </Link>
                            </CollapsibleNavItem>
                        </div>

                        <div className="nav-divider" />

                        {/* ── Configuration group — collapsible ── */}
                        <span className="nav-group-label">Configuration</span>
                        <div className="flex flex-col gap-0.5 mb-1">
                            <CollapsibleNavItem
                                label="Configuration"
                                icon={<SlidersIcon />}
                                activePrefixes={['options']}
                                closeSidebar={closeSidebar}
                            >
                                <Link
                                    href={route('options.index')}
                                    onClick={closeSidebar}
                                    className={`nav-sub-link${isActive('options') ? ' active' : ''}`}
                                >
                                    <span className="nav-icon"><SlidersIcon /></span>
                                    <span>Options</span>
                                </Link>
                            </CollapsibleNavItem>
                        </div>

                    </nav>

                    {/* User footer */}
                    <div style={{ borderTop: '1px solid var(--c-border)' }}>
                        <div className="flex items-center gap-2.5 px-4 py-3">
                            <div className="avatar">
                                <span>{initials}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-1)', letterSpacing: '-0.01em', lineHeight: 1.3 }} className="truncate">
                                    {user.name}
                                </p>
                                <p style={{ fontSize: 10.5, color: 'var(--c-text-3)', marginTop: 1, lineHeight: 1.3 }} className="truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div style={{ height: 1, background: 'var(--c-border)', margin: '0 14px' }} />

                        <div className="flex gap-2 px-3 py-3">
                            <Link href={route('profile.edit')} className="foot-btn">
                                <ProfileIcon />
                                Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="foot-btn foot-btn-danger"
                            >
                                <LogoutIcon />
                                Log out
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* ── Main column ── */}
                <div className="flex h-screen flex-1 flex-col min-w-0 overflow-hidden">

                    {/* Desktop topbar */}
                    <div
                        className="hidden lg:flex h-[var(--topbar-h)] shrink-0 items-center px-7"
                        style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}
                    >
                        {header && <div className="flex-1">{header}</div>}
                    </div>

                    {/* Mobile topbar */}
                    <div
                        className="sticky top-0 z-10 flex h-[var(--topbar-h)] shrink-0 items-center gap-3 px-4 lg:hidden"
                        style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}
                    >
                        <button
                            className="rounded-md p-1.5 focus:outline-none"
                            style={{ color: 'var(--c-text-2)', transition: 'background 0.12s' }}
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <HamburgerIcon />
                        </button>
                        <Link href="/">
                            <ApplicationLogo
                                className="h-6 w-auto fill-current"
                                style={{ color: 'var(--c-accent)' }}
                            />
                        </Link>
                    </div>

                    {/* Mobile page header */}
                    {header && (
                        <header
                            className="px-5 py-3.5 lg:hidden"
                            style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}
                        >
                            {header}
                        </header>
                    )}

                    {/* Page content */}
                    <main className="no-scrollbar flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}