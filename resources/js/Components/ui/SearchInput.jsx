/*
  Blue-branded SearchInput — matches AuthenticatedLayout + Table + Button system.
  - Inter font
  - Search icon inside the input (left)
  - Clear button appears when value is non-empty (right)
  - Blue focus ring consistent with Button's focus-visible style
*/

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '320px',
            }}
        >
            {/* Search icon */}
            <svg
                style={{
                    position: 'absolute',
                    left: '11px',
                    width: '15px',
                    height: '15px',
                    color: '#93C5FD',
                    pointerEvents: 'none',
                    flexShrink: 0,
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '100%',
                    height: '36px',
                    paddingLeft: '34px',
                    paddingRight: value ? '32px' : '12px',
                    fontSize: '13px',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontWeight: 400,
                    color: '#111827',
                    background: '#fff',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.18)';
                }}
                onBlur={e => {
                    e.target.style.borderColor = '#BFDBFE';
                    e.target.style.boxShadow = 'none';
                }}
            />

            {/* Clear button — only when there's a value */}
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    style={{
                        position: 'absolute',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#BFDBFE',
                        color: '#1D4ED8',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#93C5FD'}
                    onMouseLeave={e => e.currentTarget.style.background = '#BFDBFE'}
                >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}