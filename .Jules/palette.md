## 2026-06-10 - Added accessible delete button in PDFList
**Learning:** Screen readers announce simple text characters like '×' differently than visual users perceive them (often as 'multiplication' rather than 'close' or 'delete').
**Action:** Always provide `aria-label` for icon-only buttons, specifically for simple text characters masquerading as icons.
