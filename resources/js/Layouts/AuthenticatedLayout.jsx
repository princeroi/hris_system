import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// ── Icons ──────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21h4.5a1.125 1.125 0 001.125-1.125V14.25a1.125 1.125 0 011.125-1.125h2.25a1.125 1.125 0 011.125 1.125v5.625A1.125 1.125 0 0016.875 21h4.5a1.125 1.125 0 001.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

const EmployeesIcon = () => (
    <svg className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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

// ── Nav config ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { label: 'Dashboard',  routeName: 'dashboard',       icon: <HomeIcon /> },
    { label: 'Employees',  routeName: 'employees.index', icon: <EmployeesIcon /> },
    { label: 'Archive Employees',  routeName: 'employees.archive_employees.index', icon: <EmployeesIcon /> },
];

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

                html, body, #app {
                    height: 100%;
                    overflow: hidden;
                }

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

                    --sidebar-w:     210px;
                    --topbar-h:      60px;
                    --radius-sm:     6px;
                    --radius-md:     8px;
                }

                /* ── Hide scrollbar but keep scrolling ── */
                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }

                /* ── Nav items ── */
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 7px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 13.5px;
                    font-weight: 500;
                    color: var(--c-text-2);
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s;
                    position: relative;
                    letter-spacing: -0.01em;
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
                    left: 0; top: 6px; bottom: 6px;
                    width: 2.5px;
                    border-radius: 0 2px 2px 0;
                    background: var(--c-accent);
                }
                .nav-link .nav-icon {
                    flex-shrink: 0;
                    opacity: 0.7;
                    transition: opacity 0.12s;
                }
                .nav-link:hover .nav-icon,
                .nav-link.active .nav-icon {
                    opacity: 1;
                }

                /* ── Avatar gradient ── */
                .avatar {
                    background: linear-gradient(140deg, #C7D2FE 0%, #EEF2FF 100%);
                    border: 1px solid var(--c-accent-ring);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 32px;
                    height: 32px;
                }
                .avatar span {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--c-accent);
                    letter-spacing: 0.02em;
                    line-height: 1;
                    user-select: none;
                }

                /* ── Footer action buttons ── */
                .foot-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    flex: 1;
                    padding: 6px 10px;
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

                /* ── Slide-in overlay ── */
                .overlay-fade { animation: overlayIn 0.16s ease; }
                @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }

                /* ── Section label ── */
                .nav-group-label {
                    font-size: 10.5px;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    color: var(--c-text-3);
                    padding: 0 10px;
                    margin-bottom: 4px;
                    display: block;
                }


            `}</style>

            <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="overlay-fade fixed inset-0 z-20 lg:hidden"
                        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)' }}
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
                    <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pt-5 pb-2">
                        <span className="nav-group-label">Menu</span>
                        <div className="flex flex-col gap-0.5">
                            {NAV_ITEMS.map(({ label, routeName, icon }) => (
                                <Link
                                    key={routeName}
                                    href={route(routeName)}
                                    onClick={closeSidebar}
                                    className={`nav-link${route().current(routeName) ? ' active' : ''}`}
                                >
                                    <span className="nav-icon">{icon}</span>
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* User footer */}
                    <div style={{ borderTop: '1px solid var(--c-border)' }}>
                        {/* Identity row */}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className="avatar">
                                <span>{initials}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-1)', letterSpacing: '-0.01em', lineHeight: 1.3 }} className="truncate">
                                    {user.name}
                                </p>
                                <p style={{ fontSize: 11, color: 'var(--c-text-3)', marginTop: 1, lineHeight: 1.3 }} className="truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'var(--c-border)', margin: '0 14px' }} />

                        {/* Buttons */}
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
                        {header && (
                            <div className="flex-1">
                                {header}
                            </div>
                        )}
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
                            className="px-5 py-4 lg:hidden"
                            style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}
                        >
                            <div className="">{header}</div>
                        </header>
                    )}

                    {/* Page content */}
                    <main className="no-scrollbar flex-1 overflow-y-auto px-7 py-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}