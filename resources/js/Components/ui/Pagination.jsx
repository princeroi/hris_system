// Components/UI/Pagination.jsx

/*
  Blue-branded Pagination — matches AuthenticatedLayout + Table + Button + SearchInput system.
  - Inter font
  - Brand blue active page: #1D4ED8
  - Blue-tinted borders, hover states consistent with outline Button
  - Prev/Next as icon+label buttons matching btn-outline style
  - Smart ellipsis logic preserved unchanged
  - "Page X of Y" info label on the left
*/

const ChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

// Shared base styles (inline so no Tailwind dependency on new tokens)
const BASE = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    minWidth: '32px',
    padding: '0 10px',
    borderRadius: '8px',

    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#BFDBFE',

    background: '#fff',
    color: '#1D4ED8',
    fontSize: '13px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    outline: 'none',
    lineHeight: 1,
};

const ACTIVE = {
    ...BASE,
    background: '#1D4ED8',
    borderColor: '#1D4ED8',
    color: '#fff',
    boxShadow: '0 1px 3px rgba(29,78,216,0.25)',
    cursor: 'default',
};

const DISABLED = {
    ...BASE,
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
};

function PageBtn({ page, currentPage, onPageChange }) {
    const isActive = page === currentPage;
    return (
        <button
            onClick={() => !isActive && onPageChange(page)}
            style={isActive ? ACTIVE : BASE}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#93C5FD'; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#BFDBFE'; } }}
            aria-current={isActive ? 'page' : undefined}
        >
            {page}
        </button>
    );
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [1];
        if (currentPage > 3) pages.push('…');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('…');
        pages.push(totalPages);
        return pages;
    };

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
            {/* Page count info */}
            <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#6B7280',
                letterSpacing: '0.01em',
            }}>
                Page <span style={{ color: '#1D4ED8', fontWeight: 600 }}>{currentPage}</span> of {totalPages}
            </span>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                {/* Previous */}
                <button
                    onClick={() => !prevDisabled && onPageChange(currentPage - 1)}
                    disabled={prevDisabled}
                    style={prevDisabled ? { ...DISABLED, gap: '5px', padding: '0 12px' } : { ...BASE, gap: '5px', padding: '0 12px' }}
                    onMouseEnter={e => { if (!prevDisabled) { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#93C5FD'; } }}
                    onMouseLeave={e => { if (!prevDisabled) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#BFDBFE'; } }}
                    aria-label="Previous page"
                >
                    <ChevronLeft />
                    <span>Prev</span>
                </button>

                {/* Page numbers */}
                {getPages().map((page, index) =>
                    page === '…' ? (
                        <span key={`ellipsis-${index}`} style={{
                            width: '28px', textAlign: 'center',
                            fontSize: '13px', color: '#93C5FD',
                            letterSpacing: '0.05em', userSelect: 'none',
                        }}>
                            ···
                        </span>
                    ) : (
                        <PageBtn key={page} page={page} currentPage={currentPage} onPageChange={onPageChange} />
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => !nextDisabled && onPageChange(currentPage + 1)}
                    disabled={nextDisabled}
                    style={nextDisabled ? { ...DISABLED, gap: '5px', padding: '0 12px' } : { ...BASE, gap: '5px', padding: '0 12px' }}
                    onMouseEnter={e => { if (!nextDisabled) { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#93C5FD'; } }}
                    onMouseLeave={e => { if (!nextDisabled) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#BFDBFE'; } }}
                    aria-label="Next page"
                >
                    <span>Next</span>
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}